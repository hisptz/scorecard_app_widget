import { useSetRecoilState } from "recoil";
import ScorecardForceUpdateState from "../state/scorecard"

export default function useForceUpdate(scorecardId:string){
    const setForceUpdateState = useSetRecoilState(
        ScorecardForceUpdateState(scorecardId)
      );
      const forceUpdate = () => {
        setForceUpdateState((prevState:any) => prevState + 1);
      };
      return {
        forceUpdate,
      };
    }
