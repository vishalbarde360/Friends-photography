import api from "./axios";

// Matches backend/routes/portfolio.route.js (mounted at /api/portfolio) — public GETs, admin writes.
export const getAllPortfolios = () => api.get("/portfolio");
export const getPortfolioById = (id) => api.get(`/portfolio/${id}`);

// formData must contain: title, description, category, eventDate, location,
// coverImage (file), images (file[])
export const createPortfolio = (formData) =>
  api.post("/portfolio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updatePortfolio = (id, formData) =>
  api.put(`/portfolio/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePortfolio = (id) => api.delete(`/portfolio/${id}`);
