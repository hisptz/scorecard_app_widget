import {useDataEngine} from "@dhis2/app-runtime";
import {useSetting} from "@dhis2/app-service-datastore";
import {clone, compact, filter, isEmpty, map, uniqBy} from "lodash";
import {useCallback, useEffect, useState} from "react";
import {useRecoilRefresher_UNSTABLE, useRecoilValue} from "recoil";
import {DATA_MIGRATION_CHECK} from "../../../../../core/constants/migration";
import {AllScorecardsSummaryState} from "../../../../../core/state/scorecard";
import {migrateScorecard} from "../../../../../shared/utils/migrate";
import {generateScorecardSummary} from "../../../../../shared/utils/scorecard";
import {
    getNewScorecardKeys,
    getOldScorecardKeys,
    getOldScorecards,
    getScorecardKeys,
    uploadNewScorecard,
    uploadSummary,
    generateOldWidgetQueries
} from "../services/migrate";
import useQueue from "./useQueue";


export default function useMigrateScorecard(onComplete) {
    const [error, setError] = useState();
    const allSummary = useRecoilValue(AllScorecardsSummaryState)
    const resetSummary = useRecoilRefresher_UNSTABLE(AllScorecardsSummaryState);
    const [summaries, setSummaries] = useState();
    const engine = useDataEngine();
    const [, { set: setSkipMigration }] = useSetting(DATA_MIGRATION_CHECK, { global: true });


    const migrate = useCallback(
        async (scorecard) => {
            await uploadNewScorecard({newScorecard: scorecard, engine})
        },
        [engine],
    );

    const onMigrationComplete = useCallback(async () => {
        await uploadSummary(engine, uniqBy([...allSummary, ...summaries], 'id'))
        resetSummary();
        setSkipMigration(true);
        onComplete()
    }, [allSummary, engine, onComplete, resetSummary, setSkipMigration, summaries])

    const {add, progress, length, started} = useQueue({
        drain: onMigrationComplete,
        task: migrate
    })


    const onMigrationInitiated = useCallback(async () => {
        try {
            const scorecardKeys = await getScorecardKeys(engine);
            const oldScorecardKeys = await getOldScorecardKeys(engine);
            const newDashboardKeys = await getNewScorecardKeys(engine);
            const olddashboardKeys = clone(oldScorecardKeys);
// console.log("new dashobard keys ",newDashboardKeys)



let filteredKeyds = filter(olddashboardKeys,(oldDashboardItemId)=>{
        return !newDashboardKeys.includes(oldDashboardItemId);
   })
filteredKeyds.map(async (ids)=>{
    await generateOldWidgetQueries(ids,engine).then(idsn=>{
        console.log("respons ", idsn)
    })
})
            const filteredKeys = filter(oldScorecardKeys, (key) => {
                return !scorecardKeys.includes(key);
            });
            if (filteredKeys && !isEmpty(filteredKeys)) {
                const oldScorecards = compact(await getOldScorecards(engine, filteredKeys));
                const newScorecards = compact(map(oldScorecards, migrateScorecard));
                const newScorecardsSummaries = compact(map(newScorecards, generateScorecardSummary))
                setSummaries(newScorecardsSummaries);
                for (const scorecard of newScorecards) {
                    add(scorecard)
                }
            } else {
                onComplete();
                setSkipMigration(true)
            }
        } catch (e) {
            setError(e);
            setSkipMigration(true);
            onComplete();

        }

    }, [add, engine, onComplete, setSkipMigration])


    useEffect(() => {
        onMigrationInitiated();
    }, []);

    return {
        progress,
        count: progress + length,
        error,
        migrationStarted: started
    };
}
