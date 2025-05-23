import React from "react";
import "./GlobalSpinner.css";

export const GlobalSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-container text-center">
      <img
        src="/images/HelpBridge_logo.png"
        alt="Loading..."
        className="logo mb-4"
        width={64}
        height={64}
      />
      <div className="spinner-border accent-color" style={{ width: "3rem", height: "3rem" }} role="status" />
      <p className="mt-2 fs-3 fw-semibold accent-color">Loading HelpBridge...</p>
    </div>
  </div>
);
