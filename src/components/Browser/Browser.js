import React from "react";

import { Container } from "./Browser.styles";
import { Row } from "./Row";

export const Browser = ({ entries = [], meta, forceUpdate }) => (
  <Container>
    {entries.map((entry, index) => (
      <Row
        key={index}
        entry={entry}
        meta={meta}
        isEvenRow={index % 2 === 0}
        forceUpdate={forceUpdate}
      />
    ))}
  </Container>
);
