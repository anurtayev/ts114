import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listProjects } from "graphql/queries";

import { Container } from "./AccountingScreen.styles";

export const AccountingScreen = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const projectsData = await API.graphql(graphqlOperation(listProjects));
      const projects = projectsData.data.listTodos.items;
      setRecords(projects);
    } catch (err) {
      console.log("error fetching todos 1");
    }
  }

  return <Container></Container>;
};
