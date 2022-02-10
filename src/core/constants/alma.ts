import { almaHeaders } from "../models/alma_headers_interface";

export const ALMA_HEADERS : almaHeaders[] = [
    {
        name: "dx",
        column: "Data",
        valueType: "TEXT",
        type: "java.lang.String",
        hidden: false,
        meta: true,
      },
      {
        name: "pe",
        column: "Period",
        valueType: "TEXT",
        type: "java.lang.String",
        hidden: false,
        meta: true,
      },
      {
        name: "ou",
        column: "Organisation unit",
        valueType: "TEXT",
        type: "java.lang.String",
        hidden: false,
        meta: true,
      },
      {
        name: "value",
        column: "Value",
        valueType: "NUMBER",
        type: "java.lang.Double",
        hidden: false,
        meta: false,
      },
]