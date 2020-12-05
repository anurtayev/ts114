import React, { useState } from "react";

export const OptionSelector = ({ field, options, payload, setFieldValue }) => {
  const [isSelectionsBoxVisible, setIsSelectionsBoxVisible] = useState();
  return (
    <>
      <input
        type="text"
        onFocus={() => {
          setIsSelectionsBoxVisible(true);
        }}
        onBlur={() => setIsSelectionsBoxVisible(false)}
      />
    </>
  );
};
