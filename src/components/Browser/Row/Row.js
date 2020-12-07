import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useHistory } from "react-router-dom";

import { Container, StyledSpan, Button } from "./Row.styles";
import { routes } from "common";

const getFieldValue = ({ entry, path }) =>
  path.includes(".")
    ? path
        .split(".")
        .reduce((accumulator, current) => accumulator[current], entry)
    : entry[path];

export const Row = ({
  entry,
  meta: { fields, deleteOp, entityType },
  isEvenRow,
  forceUpdate,
  editFormReturnUrl,
}) => {
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <Container isEvenRow={isEvenRow}>
      {editFormReturnUrl === routes.timesheets && (
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
              setRedirectTo(
                `${routes.editForm}?entityType=${entityType}&callbackURI=${btoa(
                  editFormReturnUrl
                )}&formObject=${btoa(JSON.stringify({ ...entry, id: "" }))}`
              );
            }}
          >
            &#x2398;
          </Button>
          <Button
            title="Edit"
            onClick={async () => {
              setRedirectTo(
                `${routes.editForm}?entityType=${entityType}&callbackURI=${btoa(
                  editFormReturnUrl
                )}&formObject=${btoa(JSON.stringify(entry))}`
              );
            }}
          >
            &#x270D;
          </Button>
        </>
      )}

      {fields.map(
        (field, index) =>
          field.view && (
            <StyledSpan key={index} width={field.view.width}>
              {String(getFieldValue({ entry, path: field.name }))}
            </StyledSpan>
          )
      )}
    </Container>
  );
};
