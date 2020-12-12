import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";

import { Button } from "./Utilities.styles";
import { routes, GlobalContext } from "common";

export const Utilities = ({ entry, meta, editFormReturnUrl }) => {
  const history = useHistory();
  const { forceUpdate } = useContext(GlobalContext);

  const { deleteOp, entityType } = meta;

  if (!history) return null;
  return (
    <>
      <Button
        title="Delete"
        onClick={async () => {
          try {
            await API.graphql(
              graphqlOperation(deleteOp, { input: { id: entry.id } })
            );
            forceUpdate();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        &times;
      </Button>
      <Button
        title="Copy"
        onClick={async () => {
          history.push(
            `${
              routes.editForm
            }?entityType=${entityType}&isNew&callbackURI=${btoa(
              editFormReturnUrl
            )}&formObject=${btoa(JSON.stringify(meta.getObjectCopy(entry)))}`
          );
        }}
      >
        &#x2398;
      </Button>
      <Button
        title="Edit"
        onClick={async () => {
          history.push(
            `${routes.editForm}?entityType=${entityType}&callbackURI=${btoa(
              editFormReturnUrl
            )}&formObject=${btoa(JSON.stringify(entry))}`
          );
        }}
      >
        &#x270D;
      </Button>
    </>
  );
};
