import api from "./axios";

// Matches backend/routes/photo.route.js (mounted at /api/photos) — admin only.
export const getAllPhotos = () => api.get("/photos");
export const getPhotoById = (id) => api.get(`/photos/${id}`);

// formData must contain: eventId, albumId, photos (file[])
export const uploadPhotos = (formData) =>
  api.post("/photos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePhoto = (id) => api.delete(`/photos/${id}`);
