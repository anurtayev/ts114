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
} from "./ProjectRow.styles";
import { routes } from "common";
import { deleteProject, createProject } from "graphql/mutations";

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
          try {
            await API.graphql(
              graphqlOperation(deleteProject, { input: { id: project.id } })
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
            name: project.name + " Copy",
            number: project.number,
            tasks: project.tasks,
          };

          try {
            await API.graphql(
              graphqlOperation(createProject, { input: newProject })
            );
            setRedirectTo(`${routes.projectForm}/${newProject.id}`);
          } catch (error) {
            console.error(error);
          }
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
