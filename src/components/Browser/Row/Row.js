import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  Container,
  StyledSpan,
  EditIcon,
  DeleteIcon,
  CopyIcon,
} from "./Row.styles";
import { routes } from "common";

export const Row = ({
  entry,
  view,
  isEvenRow,
  getOp,
  deleteOp,
  updateOp,
  createOp,
}) => {
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <Container isEvenRow={isEvenRow}>
      <EditIcon
        onClick={() => {
          setRedirectTo(`${routes.projectForm}/${entry.id}`);
        }}
      />
      <DeleteIcon
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
      />
      <CopyIcon
        onClick={async () => {
          const newProject = {
            id: uuidv4(),
            name: entry.name + " Copy",
            number: entry.number,
            tasks: entry.tasks,
          };

          try {
            await API.graphql(
              graphqlOperation(createOp, { input: newProject })
            );
            setRedirectTo(`${routes.projectForm}/${newProject.id}`);
          } catch (error) {
            console.error(error);
          }
        }}
      />
      {view.map((field, index) => (
        <StyledSpan key={index} width={field.width}>
          {entry[field.name]}
        </StyledSpan>
      ))}
    </Container>
  );
};
