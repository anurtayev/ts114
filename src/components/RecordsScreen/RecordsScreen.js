import React, { useEffect, useState, useMemo } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta, useForceUpdate, routes } from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

export const RecordsScreen = ({ view, editFormReturnUrl }) => {
  let { updateValue, forceUpdate } = useForceUpdate();
  const [records, setRecords] = useState();

  const meta = useMemo(
    () =>
      getMeta({
        entityType: "record",
        view,
      }),
    [view]
  );

  useEffect(() => {
    const promise = API.graphql(graphqlOperation(meta.listOp));
    promise
      .then(
        ({
          data: {
            listRecords: { items },
          },
        }) => {
          setRecords(
            editFormReturnUrl === routes.accounting
              ? items
              : items.map((item) => ({
                  ...item,
                  recordProjectId: item.project.id,
                }))
          );
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, [meta, updateValue, editFormReturnUrl]);

  if (!records) return <LoadingScreen />;

  return (
    <Browser
      entries={records}
      meta={meta}
      forceUpdate={forceUpdate}
      editFormReturnUrl={editFormReturnUrl}
    />
  );
};
