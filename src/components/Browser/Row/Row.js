import React from "react";

import { Container, StyledSpan } from "./Row.styles";

const getFieldValue = ({ entry, path }) =>
  path.includes(".")
    ? path
        .split(".")
        .reduce((accumulator, current) => accumulator[current], entry)
    : entry[path];

export const Row = ({ entry, meta, fields, isEvenRow, editFormReturnUrl }) => {
  return (
    <Container isEvenRow={isEvenRow}>
      <meta.UtilityElement
        entry={entry}
        meta={meta}
        editFormReturnUrl={editFormReturnUrl}
      />

      {fields.map(
        (field, index) =>
          field.visible && (
            <StyledSpan key={index} width={field.width}>
              {String(
                field.format
                  ? field.format(getFieldValue({ entry, path: field.name }))
                  : getFieldValue({ entry, path: field.name })
              )}
            </StyledSpan>
          )
      )}
    </Container>
  );
};
