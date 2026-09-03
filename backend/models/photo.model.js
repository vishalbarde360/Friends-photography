const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            required: true,
        },

        cloudinaryPublicId: {
            type: String,
            required: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

        thumbnailUrl: {
            type: String,
        },

        originalFilename: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;