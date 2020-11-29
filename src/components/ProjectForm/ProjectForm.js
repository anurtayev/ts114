import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { getProject } from "graphql/queries";
import { createProject, updateProject } from "graphql/mutations";
import { FieldElement } from "./FieldElement";
import { StyledForm, StyledSubmitButton } from "./ProjectForm.styles";
import { ProjectSchema, getDescriptors, getView, routes } from "common";

const descriptors = getDescriptors(ProjectSchema);
const view = getView({ descriptors });

export const ProjectForm = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({
    name: "",
    number: "",
    tasks: [],
  });
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  useEffect(() => {
    projectId && fetchProject(projectId);
  }, [projectId]);

  async function fetchProject(projectId) {
    const promise = API.graphql(
      graphqlOperation(getProject, { input: { id: projectId } })
    );
    try {
      const {
        data: {
          listProjects: { items: project },
        },
      } = await promise;
      setProject(project);
    } catch (err) {
      console.error(err.message);
    }

    return function cleanup() {
      API.cancel(promise, "getProject request has been canceled");
    };
  }

  return (
    <Formik
      initialValues={project}
      validationSchema={ProjectSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const promise = projectId
          ? API.graphql(
              graphqlOperation(updateProject, {
                input: { ...values, id: projectId },
              })
            )
          : API.graphql(
              graphqlOperation(createProject, {
                input: { ...values, id: uuidv4() },
              })
            );
        try {
          await promise;
          setSubmitting(false);
          setRedirectTo(routes.projects);
        } catch (err) {
          console.error(err.message);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <StyledForm>
          {
            <>
              {view.map((field, index) => (
                <FieldElement
                  field={field}
                  key={index}
                  payload={values[field.name]}
                />
              ))}
            </>
          }
          <StyledSubmitButton type="submit" disabled={isSubmitting}>
            Submit
          </StyledSubmitButton>
        </StyledForm>
      )}
    </Formik>
  );
};
