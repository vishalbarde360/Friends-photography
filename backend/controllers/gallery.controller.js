const crypto = require("crypto");
const QRCode = require("qrcode");

const Event = require("../models/event.model");
const Photo = require("../models/photo.model");
const Album = require("../models/album.model");

const generateGalleryToken = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Generate secure random token
        const token = crypto.randomBytes(32).toString("hex");

        event.galleryToken = token;
        event.galleryStatus = "Draft";

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Gallery token generated successfully",
            data: {
                eventId: event._id,
                galleryToken: event.galleryToken,
                galleryStatus: event.galleryStatus,
            },
        });

    } catch (error) {
        console.log("Generate Gallery Token Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const publishGallery = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        if (!event.galleryToken) {
            return res.status(400).json({
                success: false,
                message: "Generate gallery token first",
            });
        }

        event.galleryStatus = "Published";

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Gallery published successfully",
            data: {
                galleryStatus: event.galleryStatus,
                galleryToken: event.galleryToken,
            },
        });

    } catch (error) {
        console.log("Publish Gallery Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const unpublishGallery = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        event.galleryStatus = "Draft";

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Gallery unpublished successfully",
            data: {
                galleryStatus: event.galleryStatus,
            },
        });

    } catch (error) {
        console.log("Unpublish Gallery Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const generateQRCode = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        if (!event.galleryToken) {
            return res.status(400).json({
                success: false,
                message: "Generate gallery token first",
            });
        }

        if (event.galleryStatus !== "Published") {
            return res.status(400).json({
                success: false,
                message: "Gallery is not published",
            });
        }

        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            return res.status(500).json({
                success: false,
                message: "FRONTEND_URL is not configured",
            });
        }

        const galleryUrl =
            `${frontendUrl}/gallery/${event.galleryToken}`;

        const qrCode = await QRCode.toDataURL(galleryUrl);

        return res.status(200).json({
            success: true,
            message: "QR code generated successfully",
            data: {
                galleryUrl,
                qrCode,
            },
        });

    } catch (error) {
        console.log("Generate QR Code Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getPrivateGallery = async (req, res) => {
    try {
        const { token } = req.params;

        const event = await Event.findOne({
            galleryToken: token,
            galleryStatus: "Published",
        }).populate("clientId", "name email");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found or not published",
            });
        }

        const albums = await Album.find({
            eventId: event._id,
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: {
                event: {
                    id: event._id,
                    title: event.title,
                    eventType: event.eventType,
                    eventDate: event.eventDate,
                    location: event.location,
                },
                albums,
            },
        });

    } catch (error) {
        console.log("Private Gallery Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getGalleryPhotos = async (req, res) => {
    try {
        const { token } = req.params;

        const event = await Event.findOne({
            galleryToken: token,
            galleryStatus: "Published",
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found or not published",
            });
        }

        const { albumId } = req.query;

        const filter = {
            eventId: event._id,
        };

        // Album filter
        if (albumId) {
            filter.albumId = albumId;
        }

        const photos = await Photo.find(filter)
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: photos.length,
            data: photos,
        });

    } catch (error) {
        console.log("Gallery Photos Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    generateGalleryToken,
    publishGallery,
    unpublishGallery,
    generateQRCode,
    getPrivateGallery,
    getGalleryPhotos,
};