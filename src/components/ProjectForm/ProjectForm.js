import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik, useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useParams, useHistory } from "react-router-dom";

import { getProject } from "graphql/queries";
import { createProject, updateProject } from "graphql/mutations";
import { FieldElement } from "./FieldElement";
import { StyledForm, StyledSubmitButton } from "./ProjectForm.styles";
import { ProjectSchema, getDescriptors, getView, routes } from "common";

const descriptors = getDescriptors(ProjectSchema);
const view = getView({ descriptors });

const ProjectFetcher = () => {
  let { setFieldValue } = useFormikContext();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      API.graphql(graphqlOperation(getProject, { id }))
        .then(({ data: { getProject: project } }) => {
          view.forEach((field) => {
            setFieldValue(field.name, project[field.name]);
          });

          setFieldValue("id", project.id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id, setFieldValue]);

  return null;
};

export const ProjectForm = () => {
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <Formik
      initialValues={{
        id: "",
        name: "",
        number: "",
        tasks: [],
      }}
      validationSchema={ProjectSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const promise = values.id
          ? API.graphql(
              graphqlOperation(updateProject, {
                input: { ...values },
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
          console.error(err);
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
          <StyledSubmitButton
            onClick={() => {
              setRedirectTo(routes.projects);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </StyledSubmitButton>
          <ProjectFetcher />
        </StyledForm>
      )}
    </Formik>
  );
};
