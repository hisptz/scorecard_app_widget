import i18n from "@dhis2/d2-i18n";
import { CircularLoader } from "@dhis2/ui";
import { isEmpty } from "lodash";
import React from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { HighlightedIndicatorsState } from "../../../../../../core/state/highlightedIndicators";
import { ScorecardViewState } from "../../../../../../core/state/scorecard";
import ErrorIcon from "../../../../../../shared/icons/ErrorIcon";
import HighlightedIndicator from "./Components/HighlightedIndicator";

export default function HighlightedIndicatorsView(){
  const highlightedIndicators = useRecoilValue(
    ScorecardViewState("highlightedIndicators")
  );
  const { highlightedIndicators: showHighlightedIndicators } =
    useRecoilValue(ScorecardViewState("options")) ?? {};
  const { state, contents } = useRecoilValueLoadable(
    HighlightedIndicatorsState
  );

  return showHighlightedIndicators && !isEmpty(highlightedIndicators) ? (
    <div className="column">
      <div>
        <h3>{i18n.t("Highlighted Indicators")}</h3>
      </div>
      {state === "loading" && (
        <div className="row center align-items-center p-16">
          <CircularLoader small />
        </div>
      )}
      {state === "hasError" && (
        <div className="row center align-items-center">
          <ErrorIcon size={24} color={""} />
          <div style={{ paddingLeft: 16 }}>
            
            {contents?.message ??
              contents?.details ??
              contents.toString() ??
              "Error"}
          </div>
        </div>
      )}
      {state === "hasValue" && (
        <div className="grid highlighted-indicators-container">
          {highlightedIndicators?.map((highlightedIndicator:any) => (
            <HighlightedIndicator
              key={highlightedIndicator?.id}
              highlightedIndicator={highlightedIndicator}
            />
          ))}
        </div>
      )}
    </div>
  ) : null;
}
