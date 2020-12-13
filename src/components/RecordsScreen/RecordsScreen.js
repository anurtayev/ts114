import React, { useEffect, useState, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";

import {
  routes,
  GlobalContext,
  isAdmin,
  RecordSchema,
  getSchemaDescriptor,
  getFields,
} from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

const schemaDescriptor = getSchemaDescriptor(RecordSchema);
const { meta } = schemaDescriptor;

export const RecordsScreen = ({ view, editFormReturnUrl }) => {
  const [records, setRecords] = useState();
  const { user } = useContext(GlobalContext);
  const [fields, setFields] = useState();

  const {
    signInUserSession: {
      idToken: {
        payload: { email },
      },
    },
  } = user;

  useEffect(() => {
    setFields(getFields({ schemaDescriptor, view }));
  }, [view]);

  useEffect(() => {
    const promise = API.graphql(
      graphqlOperation(
        meta.listOp,
        isAdmin(user)
          ? {
              filter: { submitted: { eq: true } },
            }
          : {
              filter: { userId: { eq: email } },
            }
      )
    );
    promise
      .then(
        ({
          data: {
            listRecords: { items },
          },
        }) => {
          setRecords(
            (editFormReturnUrl === routes.accounting
              ? items
              : items.map((item) => ({
                  ...item,
                  recordProjectId: item.project.id,
                }))
            ).sort((a, b) => {
              if (a.userId < b.userId) return -1;
              else if (a.userId > b.userId) return 1;
              else if (a.date < b.date) return -1;
              else if (a.date > b.date) return 1;
              else return 0;
            })
          );
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, [editFormReturnUrl, email, user]);

  if (!records) return <LoadingScreen />;

  return (
    <Browser
      entries={records}
      meta={meta}
      editFormReturnUrl={editFormReturnUrl}
      fields={fields}
    />
  );
};
