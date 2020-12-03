import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useHistory, useLocation } from "react-router-dom";

import { FieldElement } from "./FieldElement";
import { Form, Button, StyledH1, ButtonsContainer } from "./EditForm.styles";
import { getMeta } from "common";

export const EditForm = () => {
  console.log("==> EditForm");
  const { search } = useLocation();
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  const [callbackURI, setCallbackURI] = useState();
  const [meta, setMeta] = useState();
  const [formObject, setFormObject] = useState();

  useEffect(() => {
    console.log("==> search", search);
    if (search) {
      const params = new URLSearchParams(search);
      setMeta(
        getMeta({
          entityType: params.get("entityType"),
          view: params.get("view"),
        })
      );
      setCallbackURI(atob(params.get("callbackURI")));
      setFormObject(JSON.parse(atob(params.get("formObject"))));
    }
  }, [search]);

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  console.log("==> meta", meta);
  console.log("==> callbackURI", callbackURI);
  console.log("==> formObject", formObject);
  if (!meta) {
    return null;
  } else {
    const { updateOp, createOp, fields } = meta;
    return (
      <>
        <StyledH1>Edit project</StyledH1>
        <Formik
          initialValues={formObject}
          validationSchema={meta.schema}
          onSubmit={(values, { setSubmitting }) =>
            API.graphql(
              graphqlOperation(values.id ? updateOp : createOp, {
                input: {
                  ...fields.reduce((accumulator, current) => {
                    if (current.input) {
                      accumulator[current.name] = values[current.name];
                    }
                    return accumulator;
                  }, {}),
                  id: values.id ? values.id : uuidv4(),
                },
              })
            )
              .then(() => {
                setSubmitting(false);
                setRedirectTo(callbackURI);
              })
              .catch((err) => console.error(err))
          }
        >
          {({ isSubmitting, values }) => (
            <Form>
              {
                <>
                  {fields.map(
                    (field, index) =>
                      field.view && (
                        <FieldElement
                          field={field}
                          key={index}
                          payload={values[field.name]}
                        />
                      )
                  )}
                </>
              }
              <ButtonsContainer>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    setRedirectTo(callbackURI);
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
  }
};
