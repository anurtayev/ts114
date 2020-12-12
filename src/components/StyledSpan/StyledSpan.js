import React from "react";

import { Span } from "./StyledSpan.styles";

export const StyledSpan = ({ width, children }) => {
  return <Span width={width}>{children}</Span>;
};
