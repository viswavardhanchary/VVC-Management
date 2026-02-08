import React from "react";

export const Loader = ({ size = 4, color = "white" }) => {
  const px = `${size}rem`;
  return (
    <span
      className={`inline-block rounded-full animate-spin ml-3`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        border: `2px solid ${color}`,
        borderTopColor: "transparent",
      }}
      aria-hidden="true"
    />
  );
};

export default Loader;
