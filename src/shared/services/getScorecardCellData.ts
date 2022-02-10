import { Fn } from "@iapps/function-analytics";
import { Period } from "@iapps/period-utilities";
import { uniq } from "lodash";

export default async function getScorecardCellData({
  orgUnit,
  periods,
  dataSources,
}:{
    orgUnit:any,
    periods:any,
    dataSources:any,
}) {
  try {
    const previousPeriods = periods?.map((id:any) => {
      const period = new Period().setPreferences({ allowFuturePeriods: true }).getById(id);
      return period?.lastPeriod?.id;
    });
    const allPeriods = uniq([...periods, ...previousPeriods]);
    return await new Fn.Analytics()
      .setOrgUnit(orgUnit)
      .setPeriod(allPeriods?.join(";"))
      .setData(dataSources.join(";"))
      .get();
  } catch (e) {
    console.error(e);
  }
}

export async function getHighlightedIndicatorsData({
  orgUnits,
  periods,
  highlightedIndicators,
}:any) {
  try {
    return await new Fn.Analytics()
      .setOrgUnit(orgUnits?.join(";"))
      .setPeriod(periods?.join(";"))
      .setData(highlightedIndicators?.join(";"))
      .get();
  } catch (e) {
    console.error(e);
  }
}
