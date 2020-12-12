import React from "react";

import { Container, StyledSpan } from "./HeaderRow.styles";

export const HeaderRow = ({ fields, meta }) => {
  return (
    <Container>
      <meta.UtilityElementHeader />
      {fields.map(
        (field, index) =>
          field.visible && (
            <StyledSpan key={index} width={field.width}>
              {field.title}
            </StyledSpan>
          )
      )}
    </Container>
  );
};
