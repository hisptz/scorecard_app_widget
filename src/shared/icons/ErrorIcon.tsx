import { colors ,IconError24} from "@dhis2/ui";
import PropTypes from "prop-types";
import React from "react";

export default function ErrorIcon({ size, color }:{size:number,color:string}):React.ReactElement {
  //color:{color ?? colors.grey500}, fontSize: size ?? 24
  return (
    <IconError24/>
  );
}

