import axios from "axios";
import config from "../../services/config";

// Retrieve the base URL from your config
const baseURL = `${config.baseURL}`;

// Create an Axios instance
const serviceProvider = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

// Request interceptor to add Authorization header
serviceProvider.interceptors.request.use(
  async (config) => {
    // Retrieve the token from localStorage
    //const token = localStorage.getItem("authToken");
    const token = sessionStorage.getItem("token");
    //const token = "x8F!@p01,*MH";
    // const user_id = sessionStorage.getItem("username");
    // console.log("username", user_id);

    // If the token exists, set it in the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["token"] = token;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
serviceProvider.interceptors.response.use(
  async (response) => {
    // Return the response data directly
    return response.data;
  },
  async (error) => {
    // Handle errors (e.g., unauthorized, token expiration)
    if (error.response && error.response.status === 403) {
      // Optionally, handle specific cases like token expiration
      console.error(
        "Unauthorized access - possibly due to invalid/expired token"
      );
      sessionStorage.clear();
      window.location.href = "/auth/login";

      // You can also redirect to login page or refresh token here
    }

    // Reject the promise with the error object
    return Promise.reject(error?.response?.data);
  }
);

export default serviceProvider;
