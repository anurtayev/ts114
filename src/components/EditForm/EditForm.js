import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { useHistory, useLocation } from "react-router-dom";

import { FieldElement } from "./FieldElement";
import { Form, Button, StyledH1, ButtonsContainer } from "./EditForm.styles";
import { getMeta } from "common";

const coerceType = ({ field, value }) => {
  switch (field.type) {
    case "date":
      return new Date(value).toISOString();
    case "number":
      return Number(value);
    default:
      return value;
  }
};

export const EditForm = () => {
  const { search } = useLocation();
  const history = useHistory();
  const [redirectTo, setRedirectTo] = useState();

  const [callbackURI, setCallbackURI] = useState();
  const [meta, setMeta] = useState();
  const [formObject, setFormObject] = useState();
  const [entityType, setEntityType] = useState();
  const [params, setParams] = useState();
  const [isNew, setIsNew] = useState();

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
          view: "edit",
        })
      );
      setEntityType(params.get("entityType"));
      setIsNew(params.get("isNew") === null ? false : true);
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
    return (
      <>
        <StyledH1>Edit {entityType}</StyledH1>
        <Formik
          initialValues={formObject}
          validationSchema={meta.schema}
          onSubmit={(values, { setSubmitting }) => {
            API.graphql(
              graphqlOperation(isNew ? createOp : updateOp, {
                input: {
                  ...fields.reduce((accumulator, current) => {
                    if (current.input) {
                      accumulator[current.name] = coerceType({
                        field: current,
                        value: values[current.name],
                      });
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
                  Save
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
