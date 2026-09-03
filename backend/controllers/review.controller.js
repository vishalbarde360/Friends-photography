const Review = require("../models/review.model");

const createReview = async (req, res) => {
    try {
        const { name, rating, text } = req.body;

        if (!name?.trim() || !rating || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const review = await Review.create({
            name: name.trim(),
            rating: Number(rating),
            text: text.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: review,
        });
    } catch (error) {
        console.error("Create review error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create review",
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        console.error("Get reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};

module.exports = {
    createReview,
    getReviews,
};