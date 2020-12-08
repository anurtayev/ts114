import React, { useEffect, useState, useMemo, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta, useForceUpdate, routes, GlobalContext } from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

export const RecordsScreen = ({ view, editFormReturnUrl }) => {
  let { updateValue, forceUpdate } = useForceUpdate();
  const [records, setRecords] = useState();
  const { user } = useContext(GlobalContext);

  const {
    signInUserSession: {
      idToken: {
        payload: { email },
      },
    },
  } = user;

  const meta = useMemo(
    () =>
      getMeta({
        entityType: "record",
        view,
      }),
    [view]
  );

  useEffect(() => {
    const promise = API.graphql(
      graphqlOperation(meta.listOp, {
        filter: { userId: { eq: email } },
      })
    );
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
  }, [meta, updateValue, editFormReturnUrl, email]);

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
