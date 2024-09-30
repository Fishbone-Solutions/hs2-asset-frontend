// src/context/PermissionsContext.js
import React, { createContext, useContext } from "react";

// PermissionsContext to hold permissions data
const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

const PermissionsProvider = ({ children, permissions }) => {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;
