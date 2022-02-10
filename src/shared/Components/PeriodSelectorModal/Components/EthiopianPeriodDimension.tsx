import PropTypes from "prop-types";
import React from "react";
import { CalenderTypes } from "../../../../core/constants/calender";
import CalendarSpecificPeriodDimension from "./CalendarSpecificPeriodDimension";

export default function EthiopianPeriodDimension({
  onSelect,
  selectedPeriods,
}:any):React.ReactElement {
  return (
    <CalendarSpecificPeriodDimension
      onSelect={onSelect}
      selectedPeriods={selectedPeriods}
      calendar={CalenderTypes.ETHIOPIAN}
    />
  );
}

