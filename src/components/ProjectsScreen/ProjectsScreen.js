import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { getMeta, useForceUpdate } from "common";
import { Browser } from "components/Browser";

const meta = getMeta({ entityType: "project" });

export const ProjectsScreen = () => {
  console.log("==> ProjectsScreen");
  const [projects, setProjects] = useState([]);
  let { updateValue, forceUpdate } = useForceUpdate();

  useEffect(() => {
    console.log("==> ProjectsScreen useEffect");
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
              a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            )
          );
        }
      )
      .catch((err) => console.error(err));
    return () => {
      API.cancel(promise, "API request has been canceled");
    };
  }, [updateValue]);

  return <Browser entries={projects} meta={meta} forceUpdate={forceUpdate} />;
};
