import SelectionItem from "./selectionItem";

export default class PeriodSelection {
  periodSelection: any;
  constructor(periodSelection:any) {
    this.periodSelection = periodSelection;
  }

  get items() {
    return (this.periodSelection ? this.periodSelection.items : []).map(
      (item:any) => new SelectionItem(item)
    );
  }
}
