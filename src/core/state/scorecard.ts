import i18n from "@dhis2/d2-i18n";
import {Period} from "@iapps/period-utilities";
import {cloneDeep, filter, get as _get, head, isEmpty, set as _set,} from "lodash";
import {atom, atomFamily, selector, selectorFamily} from "recoil";
import {
    getColSpanDataGroups,
    getColSpanWithOrgUnit,
    getNameCellWidth,
    getTableWidthWithDataGroups,
    getTableWidthWithOrgUnit,
} from "../../modules/Main/Components/ScorecardView/Components/ScorecardTable/utils";
import getScorecard, {getOrgUnitSelection,} from "../../shared/services/getScorecard";
import getScorecardSummary, {restoreScorecardSummary,} from "../../shared/services/getScorecardSummary";
import {getHoldersFromGroups, uid} from "../../shared/utils/utils";
import {Orientation} from "../constants/orientation";
import ScorecardAccessType from "../constants/scorecardAccessType";
import {TableSort} from "../constants/tableSort";
import OrgUnitSelection from "../models/orgUnitSelection";
import Scorecard from "../models/scorecard";
import ScorecardAccess from "../models/scorecardAccess";
import ScorecardOptions from "../models/scorecardOptions";
import {EngineState} from "./engine";
import {OrgUnitChildren, SelectedOrgUnits} from "./orgUnit";
import {PeriodResolverState} from "./period";
import {SystemSettingsState} from "./system";
import {UserState} from "./user";
import {getUserAuthority} from "./utils";
import {ScreenDimensionState} from "./window";

const defaultValue = {
    legendDefinitions: [
        {
            color: "#D3D3D3",
            name: i18n.t("N/A"),
            isDefault: true,
            id: "N/A",
        },
        {
            color: "#FFFFFF",
            name: i18n.t("No Data"),
            isDefault: true,
            id: "No Data",
        },
        {
            id: uid(),
            color: "#008000",
            name: i18n.t("Target Reached/ On Track"),
        },
        {
            id: uid(),
            color: "#FFFF00",
            name: i18n.t("Progress, but more effort required"),
        },
        {
            id: uid(),
            color: "#FF0000",
            name: i18n.t("Not on track"),
        },
    ],
    scorecardOptions: new ScorecardOptions(),
    publicAccess: new ScorecardAccess({
        id: "public",
        type: "public",
        access: ScorecardAccessType.NO_ACCESS,
        displayName: "Public",
    }),
    orgUnitSelection: new OrgUnitSelection(),
    userGroupAccesses: [],
    userAccesses: [],
    highlightedIndicators: [],
};

const ScorecardIdState = atom({
    key: "scorecard-id",
    default: null,
});


const AllScorecardsSummaryState = selector({
    key: "all-scorecard-summary-state",
    get: async ({get}) => {
        const engine = get(EngineState);
        await restoreScorecardSummary(engine);
        const {summary, error} = await getScorecardSummary(engine);
        if (error) {
            throw error;
        }
        return summary;
    }
})


const ScorecardSummaryState = atom({
    key: "scorecard-summary",
    default: selector({
        key: "scorecard-summary-selector",
        get: async ({get}) => {
            const summary = get(AllScorecardsSummaryState);
            const user = get(UserState);
            return filter(summary, (scorecardSummary:any) => {
                const {read} = getUserAuthority(user, scorecardSummary) ?? {};
                return read;
            });
        },
    }),
});
//This is to force a data re-fetch when a scorecard is updated
const ScorecardRequestId = atomFamily({
    key: "scorecardForceUpdateState",
    default: 0,
});

const IsNewScorecardState = atom({
    key: "isNewScorecard",
    default: undefined,
});

const ScorecardConfState = atomFamily({
    key: "scorecard-config",
    default: selectorFamily({
        key: "active-scorecard-config",
        get:
            (scorecardId:any) =>
                async ({get}) => {
                    const engine = get(EngineState);
                    get(ScorecardRequestId(scorecardId));
                    if (scorecardId) {
                        const {scorecard, error}:any = await getScorecard(scorecardId, engine);
                        if (error) {
                            if (error?.details?.httpStatusCode === 404) {
                                throw {
                                    ...error,
                                    title: i18n.t("Scorecard Not Found"),
                                    message: i18n.t(
                                        `Scorecard with id ${scorecardId} could not be found.`
                                    ),
                                };
                            }
                            throw error;
                        }
                        const orgUnitSelection = await getOrgUnitSelection(scorecard, engine);
                        return {...scorecard, orgUnitSelection};
                    }
                    return new Scorecard(defaultValue);
                },
    }),
});

const ScorecardConfigDirtyState = atomFamily({
    key: "scorecard-config-edit-state",
    default: selectorFamily({
        key: "scorecard-state-default",
        get:
            (path) =>
                async ({get}) => {
                    const scorecardId = get(ScorecardIdState);
                    if (!isEmpty(scorecardId)) {
                        return _get(get(ScorecardConfState(scorecardId)), path);
                    }
                    return _get(new Scorecard(defaultValue), path);
                },
    }),
});

const ScorecardConfigDirtySelector = selectorFamily({
    key: "scorecard-dirty-state-selector",
    get:
        ({key, path}:any) =>
            ({get}) => {
                return _get(get(ScorecardConfigDirtyState(key)), path);
            },
    set:
        ({key, path}:any) =>
            ({get, set}, newValue) => {
                const object = get(ScorecardConfigDirtyState(key));
                const newObject = _set(cloneDeep(object), path, newValue);
                set(ScorecardConfigDirtyState(key), newObject);
            },
});

const ScorecardConfigErrorState = atom({
    key: "scorecard-config-error-state",
    default: {},
});

const ScorecardConfigErrorSelector = selectorFamily({
    key: "scorecard-config-error-selector",
    get:
        (path) =>
            ({get}) => {
                return _get(get(ScorecardConfigErrorState), path);
            },
    set:
        (path) =>
            ({set}, newValue) => {
                set(ScorecardConfigErrorState, (prevValue) =>
                    _set(prevValue, path, newValue)
                );
            },
});

const ScorecardConfigEditState = atom({
    key: "scorecard-edit-state",
    default: {},
});

const ScorecardViewState = atomFamily({
    key: "scorecard-view-config",
    default: selectorFamily({
        key: "scorecardViewStateSelector",
        get:
            (key:any) =>
                ({get}) => {
                    const scorecardId = get(ScorecardIdState);
                    const {calendar} = get(SystemSettingsState);
                    const configState = get(ScorecardConfState(scorecardId));
                    if (key === "tableSort") {
                        return {
                            orgUnit: TableSort.DEFAULT,
                            data: TableSort.DEFAULT,
                        };
                    }
                    if (key === "periodSelection") {
                        if (isEmpty(configState?.periodSelection?.periods)) {
                            const {periodType} = configState;
                            const currentPeriod = new Period()
                                .setCalendar(calendar)
                                .setPreferences({allowFuturePeriods: true});
                            if (periodType) {
                                currentPeriod.setType(periodType);

                                switch (periodType) {
                                    case "Yearly":
                                        return {
                                            periods: [currentPeriod?.get()?.list()[0]],
                                            periodType,
                                        };

                                    default:
                                        return {
                                            periods: currentPeriod?.get()?.list(),
                                            periodType,
                                        };
                                }
                            }
                        }
                    }
                    return configState[key];
                },
    }),
});

const ScorecardLegendDefinitionSelector = selectorFamily({
    key:"scorecard-legend-definition-selector",
    get:
        (isDefault:any) =>
            ({get}) => {
                const legendDefinitions = get(ScorecardViewState("legendDefinitions"));
                if (isDefault) {
                    return filter(legendDefinitions, ({isDefault}:any) => isDefault);
                }
                return filter(legendDefinitions, ({isDefault}:any) => !isDefault);
            },
});

const ScorecardTableSortState = atom({
    key: "scorecard-table-state",
    default: {},
});

const ScorecardTableOrientationState = selector({
    key: "scorecard-table-orientation-default",
    get: ({get}) => {
        const {showDataInRows} = get(ScorecardViewState("options")) ?? {};
        if (showDataInRows) {
            return Orientation.DATA_VS_ORG_UNIT;
        }
        return Orientation.ORG_UNIT_VS_DATA;
    },
    set: ({set}, newValue) => {
        set(ScorecardViewState("options"), (prevValue) => {
            return _set(
                cloneDeep(prevValue),
                "showDataInRows",
                newValue === Orientation.DATA_VS_ORG_UNIT
            );
        });
    },
});

const ScorecardTableConfigState = selectorFamily({
    key: "scorecard-table-details",
    get:
        (orgUnits) =>
            ({get}) => {
                const orientation = get(ScorecardTableOrientationState);
                const periods = get(PeriodResolverState);
                const {dataGroups} = get(ScorecardViewState("dataSelection"));
                const {averageColumn} = get(ScorecardViewState("options"));
                const {filteredOrgUnits, childrenOrgUnits} = get(
                    ScorecardOrgUnitState(orgUnits)
                );
                const {width: screenWidth}:any = get(ScreenDimensionState);
                const dataColSpan = getColSpanDataGroups(
                    periods,
                    dataGroups,
                    averageColumn
                );
                const dataNameColumnWidth = getNameCellWidth(screenWidth, dataColSpan);
                const orgUnitColSpan = getColSpanWithOrgUnit(
                    periods,
                    [...filteredOrgUnits, ...childrenOrgUnits],
                    averageColumn
                );
                const orgUnitNameColumnWidth = getNameCellWidth(
                    screenWidth,
                    orgUnitColSpan
                );

                return orientation === "orgUnitsVsData"
                    ? {
                        rows: "orgUnits",
                        columns: ["groups", "data", "periods"],
                        tableWidth: getTableWidthWithDataGroups(
                            periods,
                            dataGroups,
                            averageColumn
                        ),
                        colSpan: dataColSpan + 2,
                        nameColumnWidth: dataNameColumnWidth,
                    }
                    : {
                        rows: "data",
                        columns: ["orgUnits", "periods"],
                        tableWidth: getTableWidthWithOrgUnit(
                            periods,
                            [...filteredOrgUnits, ...childrenOrgUnits],
                            averageColumn
                        ),
                        colSpan: orgUnitColSpan + 2,
                        nameColumnWidth: orgUnitNameColumnWidth,
                    };
            },
});

const ScorecardOrgUnitState = atomFamily({
    key: "selected-org-unit-state",
    default: selectorFamily({
        key: "selected-org-units-default",
        get:
            (orgUnits:any) =>
                async ({get}) => {
                    let childrenOrgUnits = [];
                    const filteredOrgUnits = get(SelectedOrgUnits(orgUnits));
                    if (orgUnits.length === 1) {
                        childrenOrgUnits = get(OrgUnitChildren(head(orgUnits)));
                    }
                    return {
                        childrenOrgUnits,
                        filteredOrgUnits,
                        orgUnitsCount: childrenOrgUnits?.length + filteredOrgUnits?.length,
                    };
                },
    }),
});

const ScorecardDataSourceState = atom({
    key: "data-source-state",
    default: selector({
        key: "scorecard-data-sources-default",
        get: ({get}) => {
            const {dataGroups} = get(ScorecardViewState("dataSelection")) ?? {};
            return getHoldersFromGroups(dataGroups);
        },
    }),
});

const ScorecardDataLoadingState = atomFamily({
    key: "data-loading-state",
    default: undefined
});

export default ScorecardConfState;
export {
    ScorecardConfigEditState,
    ScorecardConfigDirtyState,
    ScorecardIdState,
    ScorecardSummaryState,
    ScorecardViewState,
    ScorecardRequestId,
    ScorecardConfigDirtySelector,
    ScorecardConfigErrorSelector,
    ScorecardConfigErrorState,
    ScorecardTableOrientationState,
    ScorecardTableConfigState,
    ScorecardOrgUnitState,
    ScorecardTableSortState,
    ScorecardDataSourceState,
    ScorecardDataLoadingState,
    ScorecardLegendDefinitionSelector,
    AllScorecardsSummaryState,
    IsNewScorecardState,
};
