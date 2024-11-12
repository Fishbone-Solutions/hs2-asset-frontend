import FeatureNotAvailabe from "components/svg/FeatureNotAvailabe";
import React from "react";

const ItemRequest = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <FeatureNotAvailabe width="120" height="120" />
      <h2 className="mt-4 text-center">
        This feature is not available in BETA Version
      </h2>
    </div>
  );
};

export default ItemRequest;
