import api from "./axios";

// Matches backend/routes/event.route.js (mounted at /api/events) — admin only.
export const getAllEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
