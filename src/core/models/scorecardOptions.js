import AverageDisplayType from "../constants/averageDisplayType";
import DataModel from "./base";

export default class ScorecardOption extends DataModel {
  get defaults() {
    return {
      averageDisplayType: AverageDisplayType.ALL,
      legend: true,
      title: true,
      itemNumber: true,
      emptyRows: true,
      showHierarchy: false,
      averageColumn: false,
      averageRow: false,
      highlightedIndicators: false,
    };
  }
}
