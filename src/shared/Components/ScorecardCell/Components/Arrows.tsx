import React from "react";

export const IncreasingArrows = ({ x, y, decreasing, fontSize }:{ x:number, y:number, decreasing:boolean, fontSize:number }):React.ReactElement=> (
  <path
    d={`M ${x} ${y} L ${x - fontSize / 2} ${y + fontSize} L ${
      x + fontSize / 2
    } ${y + fontSize} Z`}
    fill="black"
    transform={decreasing && "rotate(90)"}
  />
);



export const DecreasingArrows = ({ x, y, fontSize }:{ x:number, y:number, fontSize:number }):React.ReactElement => (
  <path
    d={`M ${x} ${y} L ${x - fontSize / 2} ${y - fontSize} L ${
      x + fontSize / 2
    } ${y - fontSize} Z`}
    fill="black"
  />
);

