import React from "react";

import { Container, StyledSpan } from "./HeaderRow.styles";

export const HeaderRow = ({ fields }) => {
  return (
    <Container>
      {fields.map(
        (field, index) =>
          field.view && (
            <StyledSpan key={index} width={field.view.width}>
              {field.title}
            </StyledSpan>
          )
      )}
    </Container>
  );
};
