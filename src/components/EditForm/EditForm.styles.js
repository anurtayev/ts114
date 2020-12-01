import { Form as UnstyledForm } from "formik";
import styled from "styled-components";
import { ContainerStyles } from "common";

export const Form = styled(styled(UnstyledForm)([ContainerStyles]))`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  height: 3em;
  margin-right: 1rem;
  width: 10rem;
`;

export const StyledH1 = styled.h1`
  margin-left: 1rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;
