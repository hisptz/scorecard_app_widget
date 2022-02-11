export default class LinkedDataColumnModel {
  label: any;
  dataColumns: any;
  constructor({ label, dataColumns }:any) {
    this.label = label;
    this.dataColumns = dataColumns;
  }
}
