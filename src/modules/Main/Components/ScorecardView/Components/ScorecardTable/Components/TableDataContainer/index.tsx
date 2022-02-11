import i18n from "@dhis2/d2-i18n";
import {
  Menu,
  MenuItem,
  Popover,
  IconVisualizationColumnStacked24,
  IconVisualizationLine24,
} from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import { useRecoilValue, useSetRecoilState,useResetRecoilState } from "recoil";
// import ScorecardDataEngine from "../../../../../../../../core/models/scorecardData";
import { OrgUnitLevels } from "../../../../../../../../core/state/orgUnit";
import {
  ScorecardLegendDefinitionSelector,
  ScorecardViewState,
} from "../../../../../../../../core/state/scorecard";
import { getLegend } from "../../../../../../../../shared/utils/utils";
import TableCellAnalysis from "../TableCellAnalysis";
import {cellPeriodOptionSelector,cellPeriodOptionAtom} from "../TableCellAnalysis/state/period";
import { LinkedDataCell, SingleDataCell } from "./Components/DataCells";
import LoadingCell from "./Components/LoadingCell";
export default function DataContainer({
  dataSources,
  orgUnit,
  period,
  dataEngine,
}:any) {
  const orgUnitLevels = useRecoilValue(OrgUnitLevels);
  const legendDefinitions = useRecoilValue(
    ScorecardViewState("legendDefinitions")
  );
  const { id: orgUnitId, level: dataOrgUnitLevel } = orgUnit ?? {};
  const { id: periodId } = period ?? {};
  const defaultLegendDefinitions = useRecoilValue(
    ScorecardLegendDefinitionSelector(true)
  );
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [topData, setTopData] = useState<any>();
  const [bottomData, setBottomData] = useState<any>();
  const ref = useRef(null);
  const [stateActionRef, setStateActionRef] = useState(null);
  const [showSubMenu, setShowSubMenu] = React.useState(true)
 const resetPeriodsOptionSelection = useResetRecoilState(cellPeriodOptionAtom);
 const setPeriodOptionValueStates = useSetRecoilState(cellPeriodOptionSelector);
  const [top, bottom] = dataSources ?? [];
  const { color: topColor } =
    getLegend(topData?.current, top?.legends, {
      max: top?.weight,
      defaultLegends: defaultLegendDefinitions,
      dataOrgUnitLevel,
      orgUnitLevels,
      legendDefinitions,
    }) ?? {};
  const { color: bottomColor } =
    getLegend(bottomData?.current, bottom?.legends, {
      max: bottom?.weight,
      defaultLegends: defaultLegendDefinitions,
      dataOrgUnitLevel,
      orgUnitLevels,
      legendDefinitions,
    }) ?? {};

  const loading = false;

  const topKey = `${top.id}_${orgUnitId}_${periodId}`;
  const bottomKey = `${bottom?.id}_${orgUnitId}_${periodId}`;

  useEffect(() => {
    const topSub = dataEngine.get(topKey).subscribe((data) => {
      setTopData(data);
    });
    const bottomSub = dataEngine.get(bottomKey).subscribe(setBottomData);
    //Cleanup
    return () => {
      topSub.unsubscribe();
      bottomSub.unsubscribe();
      resetPeriodsOptionSelection()
    };
  }, [orgUnitId, periodId, top, bottom]);

  return (
    <>
      <div
        data-test={"data-cell"}
        onClick={() => {
          setAnalysisOpen(true);
        }}
        onContextMenu={(e:any) => {
          e.preventDefault();
          setStateActionRef(e.target);
        }}
        ref={ref}
      >
        {loading ? (
          <LoadingCell />
        ) : dataSources?.length > 1 ? (
          <LinkedDataCell
            topIndicator={top}
            bottomIndicator={bottom}
            bottomData={bottomData}
            topData={topData}
            bottomColor={bottomColor}
            topColor={topColor}
          />
        ) : (
          <SingleDataCell indicator={top} data={topData} color={topColor} />
        )}
      </div>
      {analysisOpen && (
        <TableCellAnalysis
          orgUnit={orgUnit}
          period={period}
          dataHolder={{ dataSources }}
          onClose={() => {
            setAnalysisOpen(false);
          }}
        />
      )}
      {stateActionRef && (
        <Popover
          onClickOutside={() => setStateActionRef(undefined)}
          placement="bottom-start"
          reference={stateActionRef}
        >
          <Menu>
            <MenuItem
              onClick={() => {
                setStateActionRef(undefined);
                setAnalysisOpen(true);
              }}
              label={i18n.t("Further Analysis")}
              icon={<IconVisualizationColumnStacked24 />}
            />
            <MenuItem
              onClick={() => {
                setStateActionRef(undefined);
              }}
              showSubMenu={showSubMenu}
              toggleSubMenu={()=>{
               return setShowSubMenu(!showSubMenu)
              }}
              label={i18n.t("Trend Analysis ")}
              icon={<IconVisualizationLine24 />}
            >
              <MenuItem
                onClick={() => {
                  setStateActionRef(undefined);
                  setPeriodOptionValueStates([ new Period().setPreferences({ allowFuturePeriods: true }).getById("LAST_3_MONTHS")])
                  setAnalysisOpen(true);
                }}
                label={i18n.t("Last 3 Month")}
                icon={<IconVisualizationColumnStacked24 />}
              />
              <MenuItem
                onClick={() => {
                  setStateActionRef(undefined);
                  setPeriodOptionValueStates([ new Period().setPreferences({ allowFuturePeriods: true }).getById("LAST_6_MONTHS")])
                  setAnalysisOpen(true);
                }}
                label={i18n.t("Last 6 Month")}
                icon={<IconVisualizationColumnStacked24 />}
              />
              <MenuItem
                onClick={() => {
                  setStateActionRef(undefined);
                  setPeriodOptionValueStates([ new Period().setPreferences({ allowFuturePeriods: true }).getById("LAST_12_MONTHS")])
                  setAnalysisOpen(true);
                }}
                label={i18n.t("Last 12 Month")}
                icon={<IconVisualizationColumnStacked24 />}
              />
                <MenuItem
                onClick={() => {
                  setStateActionRef(undefined);
                  setPeriodOptionValueStates([ new Period().setPreferences({ allowFuturePeriods: true }).getById("LAST_4_QUARTERS")])
                  setAnalysisOpen(true);
                }}
                label={i18n.t("Last 4 Quarter")}
                icon={<IconVisualizationColumnStacked24 />}
              />
                <MenuItem
                onClick={() => {
                  setStateActionRef(undefined);
                  setPeriodOptionValueStates([ new Period().setPreferences({ allowFuturePeriods: true }).getById("LAST_5_YEARS")])
                  setAnalysisOpen(true);
                }}
                label={i18n.t("Last 5 Years")}
                icon={<IconVisualizationColumnStacked24 />}
              />
            </MenuItem>
            
          </Menu>
        </Popover>
      )}
    </>
  );
}

// DataContainer.propTypes = {
//   dataEngine: PropTypes.instanceOf(ScorecardDataEngine).isRequired,
//   dataSources: PropTypes.array.isRequired,
//   orgUnit: PropTypes.object.isRequired,
//   period: PropTypes.object.isRequired,
// };
