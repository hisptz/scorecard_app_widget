import {useDataMutation} from "@dhis2/app-runtime";
import produce from "immer";
import {cloneDeep, findIndex} from "lodash";
import {useCallback, useState} from "react";
import {useRecoilCallback, useRecoilState} from "recoil";
import {DATASTORE_ENDPOINT, DATASTORE_SCORECARD_SUMMARY_KEY,} from "../../../core/constants/config";
import {ScorecardSummaryState} from "../../../core/state/scorecard";

const updateMutation:any = {
    type: "update",
    resource: DATASTORE_ENDPOINT,
    id: DATASTORE_SCORECARD_SUMMARY_KEY,
    data: ({data}:any) => data,
};

export default function useScorecardsSummary() {
    const [executionError, setExecutionError] = useState();
    const [summary, setSummary] = useRecoilState(ScorecardSummaryState);
    const [update, {error: updateError, loading: updateLoading}] =
        useDataMutation(updateMutation);

    const addSingleScorecardSummary = useRecoilCallback(({set}) =>
            async (updatedSummary) => {
                try {
                    const updatedList = cloneDeep(summary) ?? [];
                    updatedList.push(updatedSummary);
                    await update({
                        data: updatedList,
                    });
                    set(ScorecardSummaryState, () => updatedList);
                } catch (e) {
                    // setExecutionError(e);
                    console.error(e);
                }
            },
        [summary, update]
    );

    const updateSingleScorecardSummary = useCallback(
        async (id, updatedSummary) => {
            try {
                const updatedList = cloneDeep(summary) ?? [];
                updatedList.splice(
                    findIndex(updatedList, ["id", id]),
                    1,
                    updatedSummary
                );
                await update({
                    data: updatedList,
                });
                setSummary(updatedList);
            } catch (e:any) {
                setExecutionError(e);
            }
        },
        [setSummary, summary, update]
    );
    const removeSingleScorecardSummary = useCallback(
        async (id) => {
            try {
                const updatedList = produce(summary, (draft:any) => {
                    draft.splice(findIndex(draft, ["id", id]), 1);
                });
                await update({
                    data: updatedList,
                });
                setSummary(updatedList);
            } catch (e:any) {
                console.error(e);
                setExecutionError(e);
            }
        },
        [setSummary, summary, update]
    );

    return {
        summary,
        error: executionError ?? updateError,
        loading: updateLoading,
        updateSingleScorecardSummary,
        removeSingleScorecardSummary,
        addSingleScorecardSummary,
    };
}
