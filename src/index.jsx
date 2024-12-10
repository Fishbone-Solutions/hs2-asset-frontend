import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLayout from "layouts/Admin"; // Adjust the import based on your file structure
import AuthLayout from "layouts/Auth"; // Adjust the import based on your file structure
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // This includes Popper.js as well
import "assets/scss/paper-dashboard.scss";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { GlobalProvider } from "./GlobalState";
import ErrorComponent from "./ErrorBoundary";
import { Tooltip } from "bootstrap"; // Import Bootstrap's Tooltip
import { Provider } from "react-redux";
import { store } from "./redux/store";

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
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltips = Array.from(tooltipTriggerList).map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    // Cleanup tooltips on unmount
    return () => {
      tooltips.forEach((tooltip) => tooltip.dispose());
    };
  }, []);
  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </React.StrictMode>
  </Provider>
);
