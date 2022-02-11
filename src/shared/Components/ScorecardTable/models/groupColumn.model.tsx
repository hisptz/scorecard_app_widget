export default class GroupColumnModel {
  id: any;
  label: any;
  dataColumns: any;
  constructor({ id, label, dataColumns }:any) {
    this.id = id;
    this.label = label;
    this.dataColumns = dataColumns;
  }
}
