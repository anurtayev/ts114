import React from "react";

import { Container } from "./Browser.styles";
import { Row } from "./Row";

export const Browser = ({
  entries = [],
  meta,
  forceUpdate,
  editFormReturnUrl,
  isReadOnly,
}) => (
  <Container>
    {entries.map((entry, index) => (
      <Row
        key={index}
        entry={entry}
        meta={meta}
        isEvenRow={index % 2 === 0}
        forceUpdate={forceUpdate}
        editFormReturnUrl={editFormReturnUrl}
        isReadOnly={isReadOnly}
      />
    ))}
  </Container>
);
