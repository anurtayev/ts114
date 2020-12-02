import React, { useEffect, useState, useMemo } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta } from "common";
import { Browser } from "components/Browser";

export const RecordsScreen = ({ view }) => {
  console.log("==> RecordsScreen");
  const meta = useMemo(
    () =>
      getMeta({
        entityType: "record",
        view,
      }),
    [view]
  );
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const promise = API.graphql(graphqlOperation(meta.listOp));
    promise
      .then(
        ({
          data: {
            listRecords: { items },
          },
        }) => {
          setRecords(items);
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, [meta]);

  return <Browser entries={records} meta={meta} />;
};
