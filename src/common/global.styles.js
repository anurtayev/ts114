import styled from "styled-components";

export const theme = {
  primaryColor: "cyan",
};

export const ContainerDiv = styled.div`
  background: ${(props) => props.theme.primaryColor};
  border: 1px solid #ccc;
  margin: 1em;
  border-radius: 0.4em;
  padding: 1em;
`;
