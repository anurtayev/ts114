import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useHistory } from "react-router-dom";

import { Container, StyledSpan, Button } from "./Row.styles";
import { routes } from "common";

export const Row = ({ entry, meta: { fields, deleteOp }, isEvenRow }) => {
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <Container isEvenRow={isEvenRow}>
      <Button
        title="Delete"
        onClick={async () => {
          try {
            await API.graphql(
              graphqlOperation(deleteOp, { input: { id: entry.id } })
            );
            history.go(0);
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
            `${
              routes.editForm
            }?entityType=project&view=default&callbackURI=${btoa(
              routes.projects
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
            `${
              routes.editForm
            }?entityType=project&view=default&callbackURI=${btoa(
              routes.projects
            )}&formObject=${btoa(JSON.stringify(entry))}`
          );
        }}
      >
        &#x270D;
      </Button>
      {fields.map((field, index) => (
        <StyledSpan key={index} width={field.view.width}>
          {entry[field.name]}
        </StyledSpan>
      ))}
    </Container>
  );
};
