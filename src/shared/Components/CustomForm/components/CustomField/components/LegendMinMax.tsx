import { Field, InputField } from "@dhis2/ui";
import React, { useMemo } from "react";
import ScorecardLegend from "../../../../../../core/models/scorecardLegend";

export default function LegendMinMax({
  name,
  value,
  onChange,
  legendDefinition,
}:any):React.ReactElement {
  const { id, color, name: legendName } = legendDefinition || {};
  const legend = useMemo(
    () => new ScorecardLegend({ legendDefinitionId: id }),
    [id]
  );

  return (
    <Field name={name} value={value} label={undefined}>
      <div className="row space-between w-100 align-items-center">
        <div className="row">
          <div
            className="pr-16"
            style={{
              backgroundColor: color,
              border: `1px solid ${color}`,
              height: 16,
              width: 24,
            }}
          />
          <label className="pl-8">{legendName}</label>
        </div>
        <div className="row space-between">
          <InputField
            value={value?.startValue}
            type="number"
            min={"0"}
            max={`${value?.max}`}
            onChange={({ value: newValue }:any) => {
              const object = value ?? legend;
              onChange({
                name,
                value: ScorecardLegend.set(object, "startValue", newValue),
              });
            }}
            className="pr-8"
            label="Min"
          />
          <InputField
            value={value?.endValue}
            type="number"
            min={`${value?.min ?? 0}`}
            onChange={({ value: newValue }:any) => {
              const object = value ?? legend;
              onChange({
                name,
                value: ScorecardLegend.set(object, "endValue", newValue),
              });
            }}
            label="Max"
          />
        </div>
      </div>
    </Field>
  );
}
