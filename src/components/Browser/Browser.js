import React from "react";

import { Container } from "./Browser.styles";
import { Row } from "./Row";

export const Browser = ({
  entries = [],
  view,
  getOp,
  deleteOp,
  updateOp,
  createOp,
}) => (
  <Container>
    {entries.map((entry, index) => (
      <Row
        key={index}
        entry={entry}
        view={view}
        isEvenRow={index % 2 === 0}
        getOp={getOp}
        deleteOp={deleteOp}
        updateOp={updateOp}
        createOp={createOp}
      />
    ))}
  </Container>
);
