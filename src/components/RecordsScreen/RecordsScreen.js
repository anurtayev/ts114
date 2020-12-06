import React, { useEffect, useState, useMemo, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta, useForceUpdate, isAdmin, GlobalContext } from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

export const RecordsScreen = ({ view, editFormReturnUrl }) => {
  let { updateValue, forceUpdate } = useForceUpdate();
  const [records, setRecords] = useState();
  const { user } = useContext(GlobalContext);

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
          setRecords(items);
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, [meta, updateValue]);

  if (!user || !records) return <LoadingScreen />;

  return (
    <Browser
      entries={records}
      meta={meta}
      forceUpdate={forceUpdate}
      editFormReturnUrl={editFormReturnUrl}
      isReadOnly={isAdmin(user)}
    />
  );
};
