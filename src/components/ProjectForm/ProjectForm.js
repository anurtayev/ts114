import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createProject } from "../../graphql/mutations";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  number: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

console.log("==>", ProjectSchema);
console.log("==>", Reflect.ownKeys(ProjectSchema.describe().fields));

export const ProjectForm = ({
  // id = "",
  name = "",
  number = "",
  // tasks = [],
}) => (
  <Formik
    initialValues={{ name, number }}
    validationSchema={ProjectSchema}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        await API.graphql(
          graphqlOperation(createProject, {
            input: { ...values, id: uuidv4(), tasks: ["t1", "t3"] },
          })
        );
        setSubmitting(false);
      } catch (err) {
        console.log("error creating todo:", err);
      }
    }}
  >
    {({ isSubmitting, errors, touched }) => (
      <Form>
        <label htmlFor="name">Project Name</label>
        <Field name="name" />
        <ErrorMessage name="name" component="div" />

        <label htmlFor="number">Project Number</label>
        <Field name="number" />
        <ErrorMessage name="number" component="div" />

        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
    )}
  </Formik>
);
