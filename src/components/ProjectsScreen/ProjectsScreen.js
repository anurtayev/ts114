import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getFields, ProjectSchema, getSchemaDescriptor, routes } from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

const schemaDescriptor = getSchemaDescriptor(ProjectSchema);
const { meta } = schemaDescriptor;
const fields = getFields({ schemaDescriptor, view: "default" });

export const ProjectsScreen = () => {
  const [projects, setProjects] = useState();

  useEffect(() => {
    const promise = API.graphql(graphqlOperation(meta.listOp, { limit: 1000 }));
    promise
      .then(
        ({
          data: {
            listProjects: { items },
          },
        }) => {
          setProjects(
            items.sort((a, b) =>
              a.number < b.number ? -1 : a.number > b.number ? 1 : 0
            )
          );
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, []);

  return projects ? (
    <Browser
      entries={projects}
      meta={meta}
      fields={fields}
      editFormReturnUrl={routes.projects}
    />
  ) : (
    <LoadingScreen />
  );
};
