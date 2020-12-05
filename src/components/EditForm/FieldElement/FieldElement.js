import React, { useState, useEffect } from "react";
import { Field, ErrorMessage, FieldArray } from "formik";

import {
  FieldContainer,
  StyledLabel,
  ArrayElementDiv,
} from "./FieldElement.styles";

const getFieldComponent = ({ field, payload, options, setFieldValue }) => {
  if (field.type === "array") {
    return (
      <FieldArray
        name={field.name}
        render={(arrayHelpers) => (
          <div>
            {payload && payload.length > 0 ? (
              payload.map((friend, index) => (
                <ArrayElementDiv key={index}>
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
                </ArrayElementDiv>
              ))
            ) : (
              <button type="button" onClick={() => arrayHelpers.push("")}>
                Add
              </button>
            )}
          </div>
        )}
      />
    );
  } else if (field.options) {
    return options ? (
      <Field
        as="select"
        name={field.name}
        onInput={
          field.selectedValueCallback &&
          ((event) => {
            field.selectedValueCallback(event.target.value);
          })
        }
      >
        {options.map((option) => (
          <option value={option[0]} key={option[0]}>
            {option[1]}
          </option>
        ))}
      </Field>
    ) : null;
  } else {
    return (
      <Field
        name={field.name}
        type={field.view.type || "text"}
        placeholder={
          field.view && field.view.type === "date" ? "yyyy-mm-dd" : ""
        }
      />
    );
  }
};

export const FieldElement = ({ field, payload, setFieldValue }) => {
  const [options, setOptions] = useState();

  useEffect(() => {
    if (field.options) {
      if (typeof field.options === "function") {
        field.options().then((options) => {
          setOptions(options);
        });
      } else if (
        typeof field.options === "object" &&
        Array.isArray(field.options)
      ) {
        setOptions(field.options);
      } else if (typeof field.options === "object") {
        // async options selector
        field.options.addEventListener(
          field.options.eventName,
          ({ detail }) => {
            field.options.getOptions({
              selectedValue: detail,
              setOptions,
            });
          }
        );
      } else {
        throw new Error("invalid options");
      }
    }
  }, [field]);

  return (
    <FieldContainer>
      <StyledLabel htmlFor={field.name}>
        {field.view.title || field.title}
      </StyledLabel>
      {getFieldComponent({ field, payload, options, setFieldValue })}
      <ErrorMessage name={field.name} component="div" />
    </FieldContainer>
  );
};
