import React from "react";
import "assets/css/loader.css";

export const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="full-page-loader">
      <div className="loader"></div>
    </div>
  );
};
