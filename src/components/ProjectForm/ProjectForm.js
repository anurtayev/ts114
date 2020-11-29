import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

import { createProject } from "graphql/mutations";
import { FieldElement } from "./FieldElement";
import { StyledForm, StyledSubmitButton } from "./ProjectForm.styles";
import { ProjectSchema, getDescriptors, getView } from "common";

const descriptors = getDescriptors(ProjectSchema);
const view = getView({ descriptors });

export const ProjectForm = ({
  // id = "",
  name = "",
  number = "",
  tasks = [],
}) => {
  let { project } = useParams();
  console.log("==> project", project);
  return (
    <Formik
      initialValues={{ name, number, tasks }}
      validationSchema={ProjectSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await API.graphql(
            graphqlOperation(createProject, {
              input: { ...values, id: uuidv4() },
            })
          );
          setSubmitting(false);
        } catch (err) {
          console.log("error creating todo:", err);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <StyledForm>
          {
            <>
              {view.map((name, index) => (
                <FieldElement
                  name={name}
                  key={index}
                  descriptor={descriptors[name]}
                  payload={values[name]}
                ></FieldElement>
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
