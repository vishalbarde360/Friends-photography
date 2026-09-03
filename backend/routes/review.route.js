const express = require("express");

const reviewRouter = express.Router();

const {
    createReview,
    getReviews,
} = require("../controllers/review.controller");

reviewRouter.post("/create", createReview);

reviewRouter.get("/get", getReviews);

module.exports = reviewRouter;