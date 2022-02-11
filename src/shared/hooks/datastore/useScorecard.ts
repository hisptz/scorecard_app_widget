import {useDataEngine, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {useSetRecoilState} from "recoil";
import {DATASTORE_ENDPOINT} from "../../../core/constants/config";
import ScorecardConfState, {ScorecardRequestId,} from "../../../core/state/scorecard";
import {generateCreateMutation, generateScorecardSummary,} from "../../utils/scorecard";
import useScorecardsSummary from "./useScorecardsSummary";

const query = {
    scorecard: {
        resource: DATASTORE_ENDPOINT,
        id: ({id}:any) => id,
    },
};

const updateMutation:any = {
    type: "update",
    resource: DATASTORE_ENDPOINT,
    id: ({id}:any) => id,
    data: ({data}:any) => data,
};

const deleteMutation:any = {
    type: "delete",
    resource: DATASTORE_ENDPOINT,
    id: ({id}:any) => id,
};

export function useDeleteScorecard(id:any) {
    const [executionError, setExecutionError] = useState();
    const [removeMutate, {loading, error: removeError}] = useDataMutation(
        deleteMutation,
        {variables: {id}}
    );
    const {removeSingleScorecardSummary, error} = useScorecardsSummary();

    const remove = async () => {
        try {
            await removeMutate({id});
            await removeSingleScorecardSummary(id);
        } catch (e:any) {
            console.error(e);
            setExecutionError(e);
        }
    };

    return {
        remove,
        error: removeError ?? executionError ?? error,
        loading,
    };
}

export function useUpdateScorecard(id:any) {
    const setScorecardRequestId = useSetRecoilState(ScorecardRequestId(id));
    const [updateMutate, {loading}] = useDataMutation(
        updateMutation,
        {variables: {id}}
    );
    const {updateSingleScorecardSummary} = useScorecardsSummary();

    const update = async (data:any) => {
        const scorecardSummary = generateScorecardSummary(data);
        await updateSingleScorecardSummary(id, scorecardSummary);
        await updateMutate({id, data});
        setScorecardRequestId((prevState) => prevState + 1);
    };

    return {
        update,
        loading,
    };
}

export function useAddScorecard() {
    const engine :any= useDataEngine();
    const {addSingleScorecardSummary} = useScorecardsSummary();

    const add = async (data:any) => {
        const scorecardSummary = generateScorecardSummary(data);
        await engine.mutate(generateCreateMutation(data?.id), {
            variables: {data},
        });
        await addSingleScorecardSummary(scorecardSummary);
    };

    return {
        add,
    };
}

export default function useScorecard(scorecardId:any) {
    const setScorecardState = useSetRecoilState(ScorecardConfState(scorecardId));
    const {loading, data, error, refetch} = useDataQuery(query, {lazy: true});

    const set = async (id:any) => {
        await refetch({id});
    };

    useEffect(() => {
        function setState() {
            if (data?.scorecard) {
                setScorecardState(() => data?.scorecard);
            }
        }

        setState();
    }, [data]);

    return {
        loading,
        error,
        set,
    };
}
