import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { listProjects } from "graphql/queries";
import { Container } from "./ProjectsScreen.styles";
import { ProjectSchema, getView } from "common";
import { ProjectRow } from "./ProjectRow";

const view = getView({ schema: ProjectSchema });

export const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const {
        data: {
          listProjects: { items: projects },
        },
      } = await API.graphql(graphqlOperation(listProjects));
      setProjects(
        projects.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      {projects &&
        projects.map((project, index) => (
          <ProjectRow
            key={index}
            project={project}
            view={view}
            isEvenRow={index % 2 === 0}
          />
        ))}
    </Container>
  );
};
