import React from "react";

export default function DisplaySourceDataSet({ data }):React.ReactElement {
  return (
    <>
      <ul>
        {data?.map((el:any) => {
          return <li key={el.id}> {el?.val} </li>;
        })}
      </ul>
    </>
  );
}
