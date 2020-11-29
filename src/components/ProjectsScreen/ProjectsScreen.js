import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { listProjects } from "graphql/queries";
import { Container } from "./ProjectsScreen.styles";
import { ProjectSchema, getDescriptors, getView } from "common";
import { ProjectRow } from "./ProjectRow";

const descriptors = getDescriptors(ProjectSchema);
const view = getView({ descriptors });

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
      setProjects(projects);
    } catch (err) {
      console.log("error fetching todos 2");
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
