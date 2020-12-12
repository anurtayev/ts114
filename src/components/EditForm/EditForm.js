import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Formik } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { FieldElement } from "./FieldElement";
import { Form, Button, StyledH1, ButtonsContainer } from "./EditForm.styles";
import { getFields, getSchema, getSchemaDescriptor } from "common";
import { LoadingScreen } from "components/LoadingScreen";

const coerceType = ({ field, value }) => {
  switch (field.type) {
    case "number":
      return Number(value);
    default:
      return value;
  }
};

export const EditForm = () => {
  const { search } = useLocation();
  const history = useHistory();
  const [callbackURI, setCallbackURI] = useState();
  const [meta, setMeta] = useState();
  const [formObject, setFormObject] = useState();
  const [entityType, setEntityType] = useState();
  const [params, setParams] = useState();
  const [isNew, setIsNew] = useState();
  const [fields, setFields] = useState();
  const [schema, setSchema] = useState();

  useEffect(() => {
    if (!search) return;
    setParams(new URLSearchParams(search));
  }, [search]);

  useEffect(() => {
    if (!params) return;
    setEntityType(params.get("entityType"));
    setIsNew(params.get("isNew") === null ? false : true);
    setCallbackURI(atob(params.get("callbackURI")));
    setFormObject(JSON.parse(atob(params.get("formObject"))));
  }, [params]);

  useEffect(() => {
    if (!entityType) return;
    setSchema(getSchema(entityType));
  }, [entityType]);

  useEffect(() => {
    if (!schema) return;
    const schemaDescriptor = getSchemaDescriptor(schema);
    setMeta(schemaDescriptor.meta);
    setFields(
      getFields({
        schemaDescriptor,
        view: "edit",
      })
    );
  }, [schema]);

  if (!meta || !formObject || !entityType || !schema || !history) {
    return <LoadingScreen />;
  } else {
    const { updateOp, createOp } = meta;
    return (
      <>
        <StyledH1>Edit {entityType}</StyledH1>
        <Formik
          initialValues={formObject}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            const input = {
              ...fields.reduce((accumulator, current) => {
                if (current.input) {
                  accumulator[current.name] = coerceType({
                    field: current,
                    value: values[current.name],
                  });
                }
                return accumulator;
              }, {}),
            };

            API.graphql(
              graphqlOperation(isNew ? createOp : updateOp, {
                input: { ...input, id: input.id ? input.id : uuidv4() },
              })
            )
              .then(() => {
                setSubmitting(false);
                history.push(callbackURI);
              })
              .catch((err) => console.error(err));
          }}
        >
          {({ isSubmitting, values, errors, setFieldValue }) => (
            <Form>
              {
                <>
                  {fields.map(
                    (field, index) =>
                      field.visible && (
                        <FieldElement
                          field={field}
                          key={index}
                          payload={values[field.name]}
                          optionsPromise={field.optionsPromise?.(values)}
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
                    history.push(callbackURI);
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
