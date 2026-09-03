import axios from "axios";

// Base URL of the Friends Photography backend (Express API).
// Set VITE_API_URL in a .env file, e.g. VITE_API_URL=http://localhost:5000
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true, // backend sets an httpOnly "token" cookie
});

export default api;
