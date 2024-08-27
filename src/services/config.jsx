const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
const config = {
  baseURL: apiUrl,
  cookieExpiry: 60 * 168,
};
export default config;
