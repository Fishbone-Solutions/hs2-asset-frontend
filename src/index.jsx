import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLayout from "layouts/Admin"; // Adjust the import based on your file structure
import AuthLayout from "layouts/Auth"; // Adjust the import based on your file structure
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.1";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { GlobalProvider } from "./GlobalState";
import ErrorComponent from "./ErrorBoundary";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} errorElement={ErrorComponent} />
    </GlobalProvider>
  </React.StrictMode>
);
