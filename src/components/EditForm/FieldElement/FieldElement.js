import React, { useState, useEffect } from "react";
import { Field, ErrorMessage, FieldArray } from "formik";

import {
  FieldContainer,
  StyledLabel,
  ArrayElementDiv,
  StyledField,
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
  } else if (field.optionsPromise) {
    return (
      options && (
        <StyledField
          as="select"
          name={field.name}
          onInput={(event) => {
            setFieldValue(field.name, event.target.value);
          }}
        >
          {options.map((option, index) => (
            <option value={option[0]} key={index}>
              {option[1]}
            </option>
          ))}
        </StyledField>
      )
    );
  } else {
    return (
      <StyledField
        name={field.name}
        type={field.type || "text"}
        placeholder={field.type === "date" ? "yyyy-mm-dd" : ""}
        width={field.width}
        onFocus={(e) => e.target.select()}
      />
    );
  }
};

export const FieldElement = ({
  field,
  payload,
  optionsPromise,
  setFieldValue,
  user,
}) => {
  const [options, setOptions] = useState();

  useEffect(() => {
    optionsPromise &&
      optionsPromise
        .then((options) => {
          setOptions(options);
          options &&
            (!options.find((element) => element[0] === payload) || !payload) &&
            setFieldValue(field.name, options[0][0]);
        })
        .catch((error) => console.error(error));
  }, [optionsPromise, field.name, setFieldValue, payload]);

  return (
    <FieldContainer>
      <StyledLabel htmlFor={field.name}>{field.title}</StyledLabel>
      {getFieldComponent({
        field,
        payload,
        options,
        setFieldValue,
      })}
      <ErrorMessage name={field.name} component="div" />
    </FieldContainer>
  );
};
