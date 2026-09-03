import api from "./axios";

// Matches backend/routes/inquiry.route.js (mounted at /api/inquiries) — public create, admin manage.
export const createInquiry = (data) => api.post("/inquiries", data);
export const getAllInquiries = () => api.get("/inquiries");
export const getInquiryById = (id) => api.get(`/inquiries/${id}`);
export const updateInquiry = (id, data) => api.put(`/inquiries/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);
