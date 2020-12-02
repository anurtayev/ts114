import styled from "styled-components";

export const Container = styled.div`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  background: ${(props) =>
    props.isEvenRow ? "aquamarine" : props.theme.primaryColor};
`;

export const StyledSpan = styled.span`
  margin: 0.7em 1em 0.3em 0;
  width: ${(props) => props.width};
`;

export const Button = styled.button`
  width: 1.75rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
`;
