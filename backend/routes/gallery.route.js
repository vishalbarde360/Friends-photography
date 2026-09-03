const express = require("express");
const {
    generateGalleryToken,
    publishGallery,
    unpublishGallery,
    generateQRCode,
    getPrivateGallery,
    getGalleryPhotos,
} = require("../controllers/gallery.controller");

const galleryRouter = express.Router();

const authUser = require("../middleware/auth.user.js");

galleryRouter.post(
    "/:eventId/generate-token",
    authUser,
    generateGalleryToken
);

galleryRouter.put(
    "/:eventId/publish",
    authUser,
    publishGallery
);

galleryRouter.put(
    "/:eventId/unpublish",
    authUser,
    unpublishGallery
);
galleryRouter.get(
    "/:eventId/qr",
    authUser,
    generateQRCode
);

// Public routes — a client views their gallery via the shared token, no login needed.
galleryRouter.get(
    "/public/:token",
    getPrivateGallery
);
galleryRouter.get(
    "/public/:token/photos",
    getGalleryPhotos
);

// PRD-friendly aliases
galleryRouter.post("/events/:eventId/token", authUser, generateGalleryToken);
galleryRouter.put("/events/:eventId/publish", authUser, publishGallery);
galleryRouter.put("/events/:eventId/unpublish", authUser, unpublishGallery);
galleryRouter.get("/events/:eventId/qr", authUser, generateQRCode);
galleryRouter.get("/:token", getPrivateGallery);
galleryRouter.get("/:token/photos", getGalleryPhotos);

module.exports = galleryRouter;