import { Form } from "formik";
import styled from "styled-components";

export const StyledForm = styled(Form)`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  margin: 1em;
  border-radius: 0.4em;
  padding: 1em;
`;

export const StyledSubmitButton = styled.button`
  height: 3em;
`;
