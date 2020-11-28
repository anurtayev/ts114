import React from "react";
import { Field, ErrorMessage, FieldArray } from "formik";

import { FieldContainer, StyledLabel } from "./FieldElement.styles";

export const FieldElement = ({ name, descriptor, payload }) => (
  <FieldContainer>
    <StyledLabel htmlFor={name}>{descriptor.meta.title}</StyledLabel>
    {descriptor.type === "array" ? (
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div>
            {payload && payload.length > 0 ? (
              payload.map((friend, index) => (
                <div key={index}>
                  <Field name={`${name}.${index}`} />
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
      <Field name={name} />
    )}
    <ErrorMessage name={name} component="div" />
  </FieldContainer>
);
