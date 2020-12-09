import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta, useForceUpdate } from "common";
import { Browser } from "components/Browser";
import { LoadingScreen } from "components/LoadingScreen";

const meta = getMeta({ entityType: "project" });

export const ProjectsScreen = () => {
  const [projects, setProjects] = useState();
  let { updateValue, forceUpdate } = useForceUpdate();

  useEffect(() => {
    const promise = API.graphql(graphqlOperation(meta.listOp));
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
  }, [updateValue]);

  return projects ? (
    <Browser entries={projects} meta={meta} forceUpdate={forceUpdate} />
  ) : (
    <LoadingScreen />
  );
};
