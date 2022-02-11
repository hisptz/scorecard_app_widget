import { DataTableHead } from "@dhis2/ui";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ScorecardTableConfigState } from "../../../../../../../../core/state/scorecard";
import GroupsHeaderRow from "./Components/GroupsHeaderRow";
import HoldersHeaderRow from "./Components/HoldersHeaderRow";
import OrgUnitHeaderRow from "./Components/OrgUnitHeaderRow";
import PeriodHeaderRow from "./Components/PeriodHeaderRow";

function getHeaderRow(type:any) {
  switch (type) {
    case "groups":
      return GroupsHeaderRow;
    case "data":
      return HoldersHeaderRow;
    case "periods":
      return PeriodHeaderRow;
    case "orgUnits":
      return OrgUnitHeaderRow;
    default:
      return null;
  }
}

export default function TableHeader({ orgUnits, nested }:any):React.ReactElement {
  const { columns } = useRecoilValue(ScorecardTableConfigState(orgUnits));
  const headerRows = useMemo(() => columns?.map(getHeaderRow), [columns]);

  return (
    <DataTableHead>
      {headerRows?.map((Row:any, i:number) => (
        <Row
          orgUnits={orgUnits}
          nested={nested}
          key={`${columns[i]}-header-row`}
        />
      ))}
    </DataTableHead>
  );
}

