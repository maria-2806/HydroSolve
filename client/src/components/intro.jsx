import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import image from "../assets/image.svg";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div
      className="intro-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="intro-content"
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          height: "80%",
          gap: "70px",
        }}
      >
        <div
          className="intro-text"
          style={{
            flex: 1,
            paddingRight: "100px",
            textAlign: "justify",
          }}
        >
          <h1>Welcome to HydroSolve!</h1>
          <p>
            Your comprehensive platform for smart water management. HydroSolve
            empowers citizens to report issues such as flooding, major leakages,
            and water wastage directly to local authorities, prioritizing cases
            based on urgency and severity. Our easy-to-use interface enables
            real-time updates, status tracking, and seamless communication with
            response teams. With HydroSolve, communities can monitor incident
            resolutions, access vital resources, and actively contribute to
            sustainable water solutions. Join us in building a responsive,
            resilient future for water management.
          </p>
        </div>
        <div
          className="intro-image"
          style={{
            flex: 1,
            paddingLeft: "20px",
          }}
        >
          <img
            src={image}
            alt="HydroSolve"
            style={{ width: "80%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
