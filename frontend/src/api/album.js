import api from "./axios";

// Matches backend/routes/album.route.js (mounted at /api/albums) — admin only.
export const getAllAlbums = () => api.get("/albums");
export const getEventAlbums = (eventId) => api.get(`/albums/event/${eventId}`);
export const getAlbumById = (id) => api.get(`/albums/${id}`);
export const createAlbum = (data) => api.post("/albums", data);
export const updateAlbum = (id, data) => api.put(`/albums/${id}`, data);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);
