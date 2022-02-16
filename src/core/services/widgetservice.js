/* eslint-disable */
import { DATASTORE_SCORECARD_WIDGET } from "../../core/constants/config";


const loadAllQuery = {
    widgets:{
        resource: DATASTORE_SCORECARD_WIDGET,
    }
}

const loadQuery ={
    widget:{
        resource: DATASTORE_SCORECARD_WIDGET,
        id: ({ id }) => id,
    }
}


const addWidgetMutation = {
    type: "create",
    resource: `${DATASTORE_SCORECARD_WIDGET}`,
    id:({id}) =>id,
    data: ({ data }) => data,
  };


export  async function loadAll(engine) {
    try {
        const response = await engine.query(loadAllQuery);
        return { widgets: response?.widgets };
    } catch (e) {
        return { error: e };
    }
}


export  async function load(id = "", engine) {
    if (id) {
        try {
            const response = await engine.query(loadQuery, { variables: { id } });
            return { widget: response?.widget };
        } catch (e) {
            return { error: e };
        }
    }
    return { error: "not found" };
}
// let widget = {
//     dashboardId:this.current_dashboard_item,
//     scoreCardId:this.selected_scorecard,
//     periodType:this.period_type,
//     period:this.period,
//     organisation_unit:this.orgunit_model
//   };
//   let scoreCardWidget = {
//     id: this.current_dashboard_item,
//     data: widget
//   };
export async function createWidget(widget,scoreCardid,engine) {
    try {
        const response = await engine.mutate(addWidgetMutation, { variables: { data: widget,id: scoreCardid } });
        return { widget: response };
    } catch (e) {
        return { error: e };
    }
}