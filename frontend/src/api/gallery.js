import api from "./axios";

// Matches backend/routes/gallery.route.js (mounted at /api/gallery)

// Admin (auth required)
export const generateGalleryToken = (eventId) =>
  api.post(`/gallery/events/${eventId}/token`);
export const publishGallery = (eventId) =>
  api.put(`/gallery/events/${eventId}/publish`);
export const unpublishGallery = (eventId) =>
  api.put(`/gallery/events/${eventId}/unpublish`);
export const getGalleryQr = (eventId) => api.get(`/gallery/events/${eventId}/qr`);

// Public — client views their gallery via the shared token, no login needed
export const getPublicGallery = (token) => api.get(`/gallery/${token}`);
export const getPublicGalleryPhotos = (token, albumId) =>
  api.get(`/gallery/${token}/photos`, { params: albumId ? { albumId } : {} });
