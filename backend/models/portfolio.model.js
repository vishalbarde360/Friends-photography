const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
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
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        coverImage: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            required: true,
            default: [],
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
    },
    {
        timestamps: true,
    }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;