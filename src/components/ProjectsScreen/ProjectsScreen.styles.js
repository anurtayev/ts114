import styled from "styled-components";
import { ContainerStyles } from "common";

export const Container = styled(styled.div([ContainerStyles]))`
  background: ${(props) => props.theme.primaryColor};
`;
