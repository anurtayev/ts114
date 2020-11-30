import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useHistory } from "react-router-dom";

import { Container, StyledSpan } from "./ProjectRow.styles";
import { ReactComponent as EditIcon } from "./edit.svg";
import { ReactComponent as DeleteIcon } from "./delete.svg";
import { routes } from "common";
import { deleteProject } from "graphql/mutations";

export const ProjectRow = ({ project, view, isEvenRow }) => {
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <Container isEvenRow={isEvenRow}>
      <EditIcon
        onClick={() => {
          setRedirectTo(`${routes.projectForm}/${project.id}`);
        }}
      />
      <DeleteIcon
        onClick={async () => {
          await API.graphql(
            graphqlOperation(deleteProject, { input: { id: project.id } })
          );
          history.go(0);
        }}
      />
      {view.map((field, index) => (
        <StyledSpan key={index} width={field.width}>
          {project[field.name]}
        </StyledSpan>
      ))}
    </Container>
  );
};
