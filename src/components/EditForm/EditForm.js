import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { useHistory, useLocation } from "react-router-dom";

import { FieldElement } from "./FieldElement";
import { Form, Button, StyledH1, ButtonsContainer } from "./EditForm.styles";
import { getMeta } from "common";

export const EditForm = () => {
  const { search } = useLocation();
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  const [callbackURI, setCallbackURI] = useState();
  const [meta, setMeta] = useState();
  const [formObject, setFormObject] = useState();
  const [entityType, setEntityType] = useState();
  const [params, setParams] = useState();

  useEffect(() => {
    if (search) {
      setParams(new URLSearchParams(search));
    }
  }, [search]);

  useEffect(() => {
    if (params) {
      setMeta(
        getMeta({
          entityType: params.get("entityType"),
          view: params.get("view"),
        })
      );
      setEntityType(params.get("entityType"));
      setCallbackURI(atob(params.get("callbackURI")));
      setFormObject(JSON.parse(atob(params.get("formObject"))));
    }
  }, [params]);

  useEffect(() => {
    redirectTo && history.push(redirectTo);
  }, [history, redirectTo]);

  if (!meta) {
    return null;
  } else {
    const { updateOp, createOp, fields } = meta;
    console.log("==> callbackURI", callbackURI);
    console.log("==> meta", meta);
    console.log("==> formObject", formObject);
    console.log("==> entityType", entityType);
    return (
      <>
        <StyledH1>Edit {entityType}</StyledH1>
        <Formik
          initialValues={formObject}
          validationSchema={meta.schema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("==> submit form");
            API.graphql(
              graphqlOperation(values.id ? updateOp : createOp, {
                input: {
                  ...fields.reduce((accumulator, current) => {
                    if (current.input) {
                      accumulator[current.name] = values[current.name];
                    }
                    return accumulator;
                  }, {}),
                },
              })
            )
              .then(() => {
                setSubmitting(false);
                setRedirectTo(callbackURI);
              })
              .catch((err) => console.error(err));
          }}
        >
          {({ isSubmitting, values, setFieldValue, errors }) => (
            <Form>
              {
                <>
                  <p>{JSON.stringify(errors)}</p>
                  {fields.map(
                    (field, index) =>
                      field.view && (
                        <FieldElement
                          field={field}
                          key={index}
                          payload={values[field.name]}
                          setFieldValue={setFieldValue}
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
