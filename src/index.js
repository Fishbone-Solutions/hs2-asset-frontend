import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminLayout from 'layouts/Admin.js'; // Adjust the import based on your file structure
import AuthLayout from 'layouts/Auth.js'; // Adjust the import based on your file structure
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.1";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { GlobalProvider } from './GlobalState';
import ErrorComponent from 'ErrorBoundary';

// Create the router using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/auth/*',
    element: <AuthLayout />,
  },
  {
    path: '/admin/*',
    element: <AdminLayout />,
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application using RouterProvider
root.render(
  <GlobalProvider>
    <RouterProvider router={router} errorElement={ErrorComponent} />
  </GlobalProvider>
);
