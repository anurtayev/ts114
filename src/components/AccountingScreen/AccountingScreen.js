import React, { useEffect, useState } from "react";
import "./AccountingScreen.styles.js";
import { API, graphqlOperation } from "aws-amplify";
import { createProject } from "../../graphql/mutations";
import { listProjects } from "../../graphql/queries";
import styled from "styled-components";

const RedContainer = styled.div`
  width: 400;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20;
  border: 1px solid;
  margin: 1em;
`;

const initialState = { name: "", number: "", tasks: ["t1", "t2"] };

export const AccountingScreen = () => {
  const [formState, setFormState] = useState(initialState);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchProjects() {
    try {
      const projectsData = await API.graphql(graphqlOperation(listProjects));
      const projects = projectsData.data.listTodos.items;
      setProjects(projects);
    } catch (err) {
      console.log("error fetching todos 1");
    }
  }

  async function addProject() {
    try {
      if (!formState.name || !formState.number) return;
      const project = { ...formState };
      setProjects([...projects, project]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createProject, { input: project }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <RedContainer>
      <h2>Amplify Todos</h2>
      <input
        onChange={(event) => setInput("name", event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput("number", event.target.value)}
        style={styles.input}
        value={formState.number}
        placeholder="Number"
      />
      <button style={styles.button} onClick={addProject}>
        Create Todo
      </button>
      {projects.map((project, index) => (
        <div key={project.id ? project.id : index} style={styles.todo}>
          <p style={styles.todoName}>{project.name}</p>
          <p style={styles.todoDescription}>{project.number}</p>
        </div>
      ))}
    </RedContainer>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};
