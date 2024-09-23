import React from "react";

function ExampleCarouselImage({ text }) {
  return (
    <div
      style={{
        backgroundColor: "black",
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3 style={{ color: "white" }}>{text}</h3>
    </div>
  );
}

export default ExampleCarouselImage;
