import React from "react";
import "./GlobalSpinner.css";

export const GlobalSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-container text-center">
      <img
        src="/images/HelpBridge_logo.png"
        alt="Loading..."
        className="logo mb-4"
        width={200}
        height={180}
        style={{ objectFit: "contain" }}
      />
      <div className="spinner-border accent-color"  
      style={{ width: "4rem", height: "4rem", display: "block", margin: "0 auto" }} role="status" />
      <p className="mt-4 fs-3 fw-semibold accent-color welcome-font">Loading...</p>
    </div>
  </div>
);
