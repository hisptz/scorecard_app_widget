import { useDeleteScorecard } from "./useScorecard";
import useScorecardsSummary from "./useScorecardsSummary";

export default function useAllScorecards() {
  const {
    removeSingleScorecardSummary,
    error,
    loading,
    summary,
    updateLoading,
  }:any = useScorecardsSummary();
  const {
    remove,
    loading: removeLoading,
    error: removeError,
  }:any = useDeleteScorecard("");

  const deleteScorecard = async (id:any) => {
    await remove({
      id,
    });
    await removeSingleScorecardSummary(id);
  };

  return {
    scorecards: summary,
    error: error ?? removeError,
    loading,
    removeLoading: removeLoading || updateLoading,
    remove: deleteScorecard,
  };
}
