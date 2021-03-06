import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Error from "../../../../../Shared/Componets/Error/ErrorAPIResult";
import Loader from "../../../../../Shared/Componets/Loaders/Loader";
import { programDataElementCountState } from "../../../../../Store";

const query = {
  programs: {
    resource: "programStages",
    params: ({ dataElementId }) => ({
      fields: ["program[id,displayName]"],
      filter: [`programStageDataElements.dataElement.id:eq:${dataElementId}`],
    }),
  },
};

export default function Programs({ id, name }) {
  const dataElementId = id;

  const updateCount = useSetRecoilState(programDataElementCountState);

  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: { dataElementId },
  });

  useEffect(() => {
    refetch({ id });
  }, [id]);

  useEffect(() => {
    updateCount((prev) => {
      return prev + data?.programs?.programStages?.length;
    });
  }, [data]);

  if (loading) {
    return <Loader text={""} />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <div>
      {name}
      <ul>
        {data?.programs?.programStages?.map((dt) => {
          return (
            <li key={dt?.program?.id}>
              <b>{dt?.program?.displayName}</b>{" "}
              {i18n.t("submitting records on every event(case or individual)")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Programs.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
