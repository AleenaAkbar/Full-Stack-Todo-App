import axios from "axios";

// Prefer VITE_API_URL; in dev fall back to local server
const resolvedBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://todo-backend-production-cee8.up.railway.app");

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 seconds timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
