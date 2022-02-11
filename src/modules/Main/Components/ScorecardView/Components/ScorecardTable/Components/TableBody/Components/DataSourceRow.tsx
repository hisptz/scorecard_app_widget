import { DataTableCell, DataTableRow } from "@dhis2/ui";
import { head } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import AverageDisplayType from "../../../../../../../../../core/constants/averageDisplayType";
import { DraggableItems } from "../../../../../../../../../core/constants/draggables";
// import ScorecardDataEngine from "../../../../../../../../../core/models/scorecardData";
import { PeriodResolverState } from "../../../../../../../../../core/state/period";
import {
  ScorecardOrgUnitState,
  ScorecardViewState,
} from "../../../../../../../../../core/state/scorecard";
import { getDataSourcesDisplayName } from "../../../../../../../../../shared/utils/utils";
import DataContainer from "../../TableDataContainer";
import AverageCell from "./AverageCell";
import DraggableCell from "./DraggableCell";
import DroppableCell from "./DroppableCell";

export default function DataSourceRow({
  orgUnits,
  dataSources,
  overallAverage,
  dataEngine,
  index,
}:any):React.ReactElement {
  const { emptyRows, averageColumn, averageDisplayType, itemNumber } =
    useRecoilValue(ScorecardViewState("options"));
  const [isEmpty, setIsEmpty] = useState(false);
  const [average, setAverage] = useState<any>();
  const { filteredOrgUnits, childrenOrgUnits } = useRecoilValue(
    ScorecardOrgUnitState(orgUnits)
  );
  const periods = useRecoilValue(PeriodResolverState) ?? [];

  useEffect(() => {
    const rowStatusSub = dataEngine
      .isDataSourcesRowEmpty(dataSources?.map(({ id }:any) => id))
      .subscribe(setIsEmpty);
    const rowAverageSub = dataEngine
      .getDataSourceAverage(dataSources?.map(({ id }:any) => id))
      .subscribe(setAverage);
    return () => {
      rowStatusSub.unsubscribe();
      rowAverageSub.unsubscribe();
    };
  }, [dataSources]);

  const Component = (
    <DataTableRow bordered>
      <DataTableCell
        className="jsx-1369417008"
        fixed
        left={"0"}
        width={"50px"}
      />
      {itemNumber && (
        <DataTableCell fixed left={"50px"} width={"50px"}>
          {index + 1}
        </DataTableCell>
      )}
      <DataTableCell
        fixed
        left={itemNumber ? "100px" : "50px"}
        className="scorecard-org-unit-cell"
      >
        <DroppableCell accept={[DraggableItems.ORG_UNIT_COLUMN]}>
          <DraggableCell
            label={getDataSourcesDisplayName(dataSources)}
            type={DraggableItems.DATA_ROW}
          />
        </DroppableCell>
      </DataTableCell>
      {[...filteredOrgUnits, ...childrenOrgUnits]?.map((orgUnit) =>
        periods?.map((period:any) => (
          <td
            className="data-cell"
            align="center"
            key={`${orgUnit?.id}-${head(dataSources)?.id}-${period?.id}`}
          >
            <DataContainer
              dataEngine={dataEngine}
              orgUnit={orgUnit}
              dataSources={dataSources}
              period={period}
            />
          </td>
        ))
      )}
      {averageColumn && <AverageCell  dataSources={dataSources} bold value={average} />}
    </DataTableRow>
  );

  if (averageDisplayType === AverageDisplayType.ALL) {
    return (emptyRows || !isEmpty) && Component;
  }
  if (
    averageDisplayType === AverageDisplayType.BELOW_AVERAGE &&
    overallAverage > average
  ) {
    return (emptyRows || !isEmpty) && Component;
  }
  if (
    averageDisplayType === AverageDisplayType.ABOVE_AVERAGE &&
    overallAverage <= average
  ) {
    return (emptyRows || !isEmpty) && Component;
  }

  return <></>;
}

