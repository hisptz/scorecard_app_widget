import i18n from "@dhis2/d2-i18n";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRow,
  TableBody,
  TableHead,
} from "@dhis2/ui";
import React from "react";
import { useRecoilValue } from "recoil";
import { dataElementsStateDictionary } from "../../../../Store";
import Row from "./row";

export default function DataElementSIndicator() {
  const dataElements = useRecoilValue(dataElementsStateDictionary);

  if (dataElements?.length === 0) {
    return (
      <div>
        <h3> {i18n.t("Data elements in indicator")} </h3>
        <p>
          {i18n.t("There were no Data Elements in the Indicator Calculations")}{" "}
        </p>
      </div>
    );
  }

  let i = 0;
  return (
    <div>
      <h3>{i18n.t("Data elements in indicator")} </h3>
      <p>
        {" "}
        {i18n.t(
          "The following is the summary of the data elements used in calculations:"
        )}{" "}
      </p>

      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader bordered>
              {i18n.t("Data Element")}
            </DataTableColumnHeader>
            <DataTableColumnHeader bordered>
              {i18n.t("Expression part (Numerator/ Denominator)")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Value Type")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Zero Significance")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Categories")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              {i18n.t("Datasets/ Programs")}
            </DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Groups")}</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          {dataElements?.map((dtEle) => {
            i++;
            return <Row key={i} datEl={dtEle} />;
          })}
        </TableBody>
      </DataTable>
    </div>
  );
}
