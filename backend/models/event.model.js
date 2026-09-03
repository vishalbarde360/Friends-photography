const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        eventType: {
            type: String,
            required: true,
            enum: [
                "Wedding",
                "Pre-Wedding",
                "Birthday",
                "Corporate",
                "Events",
                "Other",
            ],
        },

        eventDate: {
            type: Date,
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        package: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Upcoming",
                "Ongoing",
                "Completed",
                "Cancelled",
            ],
            default: "Upcoming",
        },

        galleryToken: {
            type: String,
            unique: true,
            sparse: true,
        },

        galleryStatus: {
            type: String,
            enum: [
                "Draft",
                "Published",
                "Archived",
            ],
            default: "Draft",
        },
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;