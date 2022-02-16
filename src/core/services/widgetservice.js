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




function generateAddWidgetMutation (id){
    return {
        type: "create",
        resource: `${DATASTORE_SCORECARD_WIDGET}/${id}`,
        data: ({ data }) => data,
      }
}
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

export async function createWidget(widget,dashboardId,engine) {
    const addWidgetMutation = {
        type: "create",
        resource: `${DATASTORE_SCORECARD_WIDGET}/${dashboardId}`,
        data: ({ data }) => data,
      };
    try {
        const response = await engine.mutate(addWidgetMutation, { variables: { data: widget} });
        return { widget: response };
    } catch (e) {
        return { error: e };
    }
}