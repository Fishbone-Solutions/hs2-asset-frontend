import React, { useState } from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = ({
    title,
    content,
    type,
    onConfirm,
    onCancel,
    showCancelButton = true,
    confirmText = "Yes",
    cancelText = "Cancel",
  }) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={title}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={confirmText}
        cancelBtnText={cancelText}
        showCancel={showCancelButton}
        type={type}
        btnSize=""
      >
        {content}{" "}
        {/* This will contain custom inputs like text field or dropdown */}
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return {
    alert,
    showAlert,
    hideAlert,
  };
};
