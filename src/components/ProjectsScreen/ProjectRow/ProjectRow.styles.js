import styled from "styled-components";

export const Container = styled.div`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  background: ${(props) =>
    props.isEvenRow ? "aquamarine" : props.theme.primaryColor};
`;

export const StyledSpan = styled.span`
  margin: 0 1em 1em 0;
  width: ${(props) => props.width};
`;
