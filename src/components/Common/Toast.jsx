import React from "react";
import { toast } from "react-toastify";

// Define types for different toasts
const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

// Create a function that returns the appropriate toast function
const getToastFunction = (type) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return toast.success;
    case TOAST_TYPES.ERROR:
      return toast.error;
    case TOAST_TYPES.WARNING:
      return toast.warn;
    default:
      return toast;
  }
};

const DynamicToast = ({ type, message }) => {
  React.useEffect(() => {
    const toastFunction = getToastFunction(type);
    toastFunction(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, [type, message]);

  return null; // This component does not render anything
};

export default DynamicToast;
