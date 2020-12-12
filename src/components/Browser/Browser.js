import React from "react";

import { Container } from "./Browser.styles";
import { Row } from "./Row";
import { HeaderRow } from "./HeaderRow";

export const Browser = ({ entries, meta, editFormReturnUrl, fields }) => (
  <Container>
    <HeaderRow meta={meta} fields={fields}></HeaderRow>
    {entries.map((entry, index) => (
      <Row
        key={index}
        entry={entry}
        meta={meta}
        fields={fields}
        isEvenRow={index % 2 === 0}
        editFormReturnUrl={editFormReturnUrl}
      />
    ))}
  </Container>
);
