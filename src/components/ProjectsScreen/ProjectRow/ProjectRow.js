import React from "react";

import { Container, StyledSpan } from "./ProjectRow.styles";

export const ProjectRow = ({ project, view, isEvenRow }) => {
  return (
    <Container isEvenRow={isEvenRow}>
      {view.map((field, index) => (
        <StyledSpan key={index} width={field.width}>
          {project[field.name]}
        </StyledSpan>
      ))}
    </Container>
  );
};
