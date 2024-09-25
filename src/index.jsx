import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLayout from "layouts/Admin"; // Adjust the import based on your file structure
import AuthLayout from "layouts/Auth"; // Adjust the import based on your file structure
import "bootstrap/dist/css/bootstrap.css";
import { createPopper } from "@popperjs/core";

import "assets/scss/paper-dashboard.scss?v=1.3.1";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { GlobalProvider } from "./GlobalState";
import ErrorComponent from "./ErrorBoundary";
import { Tooltip } from "bootstrap";

// Create the router using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/auth/*",
    element: <AuthLayout />,
    errorElement: <ErrorComponent />,
  },
  {
    path: "/admin/*",
    element: <AdminLayout />,
    errorElement: <ErrorComponent />,
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
]);

const App = () => {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);
  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
