import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik, useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useParams, useHistory, useLocation } from "react-router-dom";

import { getProject } from "graphql/queries";
import { createProject, updateProject } from "graphql/mutations";
import { FieldElement } from "./FieldElement";
import { Form, Button, StyledH1, ButtonsContainer } from "./EditForm.styles";
import { ProjectSchema, RecordSchema, getView, routes } from "common";

export const EditForm = () => {
  const { search } = useLocation();
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  const [callbackPath, setCallbackPath] = useState();
  const [view, setView] = useState();
  const [formObject, setFormObject] = useState();

  useEffect(() => {
    if (search) {
      const params = new URLSearchParams(search);
      const view = getView({
        schema:
          params.get("formType") === "project" ? ProjectSchema : RecordSchema,
        view: params.get("view"),
      });
      setView(view);
      setCallbackPath(params.get("callbackPath"));
      setFormObject(params.get("formObject"));
    }
  }, [search]);

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  return (
    <>
      <StyledH1>Edit project</StyledH1>
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
            setRedirectTo(callbackPath);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
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
            <ButtonsContainer>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
              <Button
                onClick={() => {
                  setRedirectTo(callbackPath);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </ButtonsContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};
