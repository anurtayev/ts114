import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createProject } from "../../graphql/mutations";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

import { FieldElement } from "./FieldElement";
import { StyledForm, StyledSubmitButton } from "./ProjectForm.styles";

const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({ title: "Project name" }),
  number: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({ title: "Project number" }),
  tasks: Yup.array()
    .of(Yup.string().min(1).required())
    .min(1)
    .required()
    .meta({ title: "Project tasks" }),
});
const fields = ProjectSchema.describe().fields;

export const ProjectForm = ({
  // id = "",
  name = "",
  number = "",
  tasks = [],
}) => (
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
    {({ isSubmitting, errors, touched, values }) => (
      <StyledForm>
        {
          <>
            {Reflect.ownKeys(fields).map((name, index) => (
              <FieldElement
                name={name}
                key={index}
                descriptor={fields[name]}
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
