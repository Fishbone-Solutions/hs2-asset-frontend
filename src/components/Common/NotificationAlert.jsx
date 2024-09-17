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
    customHeader = null,
  }) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={customHeader ? customHeader : title}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={confirmText}
        cancelBtnText={cancelText}
        showCancel={showCancelButton}
        type={type}
        btnSize=""
        closeOnClickOutside={false} // Prevent closing when clicking outside
        showCloseButton={false} // Disable the close button (X) at the top right
      >
        {content}
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
