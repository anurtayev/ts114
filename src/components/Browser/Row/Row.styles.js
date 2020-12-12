import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  background: ${(props) =>
    props.isEvenRow ? props.theme.rowAlternate : props.theme.primaryColor};
`;

export const StyledSpan = styled.span`
  margin: 0.7em 1em 0.3em 0;
  width: ${(props) => props.width};
`;

export const Button = styled.button`
  width: 1.75rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
`;
