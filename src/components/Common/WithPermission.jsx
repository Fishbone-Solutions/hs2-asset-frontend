// src/components/withPermission.js
import React from "react";
import { usePermissions } from "../../context/PermissionsContext";
import { Redirect } from "react-router-dom";

const withPermission = (Component, requiredPermission) => {
  return (props) => {
    const permissions = usePermissions();

    if (permissions.includes(requiredPermission)) {
      return <Component {...props} />;
    } else {
      return <Redirect to="/not-authorized" />;
    }
  };
};

export default withPermission;
