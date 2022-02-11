import React from "react";

export default function LegendView({ legend }:any):React.ReactElement  {
  const { name, color } = legend ?? { color: "#FFFFFF" };
  return (
    <div className="row align-items-center">
      <div
        style={{
          width: 60,
          height: 25,
          background: color,
          border: "1px solid rgb(232, 237, 242)",
          padding: 16,
        }}
      ></div>
      <p style={{ paddingLeft: 8, marginRight: 8 }}>{name}</p>
    </div>
  );
}

