import React from "react";
import { Field, ErrorMessage, FieldArray } from "formik";

import { FieldContainer, StyledLabel } from "./FieldElement.styles";

export const FieldElement = ({ field, payload }) => (
  <FieldContainer>
    <StyledLabel htmlFor={field.name}>{field.title}</StyledLabel>
    {field.type === "array" ? (
      <FieldArray
        name={field.name}
        render={(arrayHelpers) => (
          <div>
            {payload && payload.length > 0 ? (
              payload.map((friend, index) => (
                <div key={index}>
                  <Field name={`${field.name}.${index}`} />
                  <button
                    type="button"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => arrayHelpers.insert(index, "")}
                  >
                    +
                  </button>
                </div>
              ))
            ) : (
              <button type="button" onClick={() => arrayHelpers.push("")}>
                Add
              </button>
            )}
          </div>
        )}
      />
    ) : (
      <Field name={field.name} />
    )}
    <ErrorMessage name={field.name} component="div" />
  </FieldContainer>
);
