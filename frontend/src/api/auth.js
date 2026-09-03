import api from "./axios";

// Matches backend/routes/user.route.js (mounted at /api/auth and /api/user)
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const setupAdmin = (data) => api.post("/auth/setup-admin", data);
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
