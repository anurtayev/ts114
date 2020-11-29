import { Form } from "formik";
import styled from "styled-components";
import { ContainerStyles } from "common";

export const StyledForm = styled(styled(Form)([ContainerStyles]))`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  flex-direction: column;
`;

export const StyledSubmitButton = styled.button`
  height: 3em;
`;
