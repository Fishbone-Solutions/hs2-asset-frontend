// RouteProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import routes from './routes'; // Import your routes from the routes file

const RouteContext = createContext();

export const useRouteContext = () => useContext(RouteContext);

const RouteProvider = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState([]);

  // Function to load permissions from session storage
  const loadPermissions = () => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const permissions = JSON.parse(user).user_permissions || [];
      setUserPermissions(permissions);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // Function to check permissions
  const hasPermission = (module_slug, permission_type) => {
    return userPermissions.some(
      permission => 
        permission.permission_slug === module_slug && 
        permission.permission_value.includes(permission_type)
    );
  };

  // Update routes based on permissions
  const updatedRoutes = routes.map(route => {
    if (route.hidden === undefined) {
      route.hidden = !hasPermission(route.path.split('/')[1], 'View');
    }
    return route;
  });

  return (
    <RouteContext.Provider value={{ updatedRoutes, loadPermissions }}>
      {children}
    </RouteContext.Provider>
  );
};

export default RouteProvider;
