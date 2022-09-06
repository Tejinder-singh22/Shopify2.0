import React from "react";
import "../assets/css/spinner.css";

export default function LoadingSpinner() {
  return (
    <div id='my-spinner' className="spinner-container">
      <div id='my-inner-spinner' className="loading-spinner">
      </div>
    </div>
  );
}