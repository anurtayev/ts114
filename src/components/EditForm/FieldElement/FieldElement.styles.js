import styled from "styled-components";
import { Field } from "formik";

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const StyledLabel = styled.label`
  margin-bottom: 1em;
`;

export const ArrayElementDiv = styled.div`
  margin-bottom: 0.5rem;
`;

export const StyledField = styled(Field)`
  height: 2rem;
  width: ${(props) => props.width};
  background-color: white;
`;
