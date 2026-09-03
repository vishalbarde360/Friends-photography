const portfolioModel = require("../models/portfolio.model.js");
const { uploadFile, deleteFile } = require("../services/cloudinary.js");

const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes("/upload/")) return null;
    const withoutQuery = url.split("?")[0];
    const afterUpload = withoutQuery.split("/upload/")[1];
    if (!afterUpload) return null;
    const parts = afterUpload.split("/");
    if (parts[0].match(/^v\d+$/)) parts.shift();
    const filename = parts.pop();
    return [...parts, filename.replace(/\.[^/.]+$/, "")].join("/");
};

const createPortfolio = async (req, res) => {
    try {
        const { title, description, category, eventDate, location } = req.body;
        if (!title || !description || !category || !eventDate || !location) {
            return res.status(400).json({ success: false, message: "All text fields are required" });
        }
        if (!req.files?.coverImage?.length) {
            return res.status(400).json({ success: false, message: "Cover image is required" });
        }
        if (!req.files?.images?.length) {
            return res.status(400).json({ success: false, message: "At least one gallery image is required" });
        }

        const coverResult = await uploadFile(req.files.coverImage[0], "friends-photography/portfolio");
        const imageResults = await Promise.all(req.files.images.map((file) => uploadFile(file, "friends-photography/portfolio")));

        const portfolio = await portfolioModel.create({
            title, description, category, eventDate, location,
            coverImage: coverResult.secure_url,
            images: imageResults.map((item) => item.secure_url),
        });

        return res.status(201).json({ success: true, message: "Portfolio created successfully", data: portfolio });
    } catch (error) {
        console.error("Create Portfolio Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await portfolioModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: portfolios.length, data: portfolios });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getPortfolioById = async (req, res) => {
    try {
        const portfolio = await portfolioModel.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ success: false, message: "Portfolio not found" });
        return res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updatePortfolio = async (req, res) => {
    try {
        const portfolio = await portfolioModel.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ success: false, message: "Portfolio not found" });

        const { title, description, category, eventDate, location } = req.body;
        if (title !== undefined) portfolio.title = title;
        if (description !== undefined) portfolio.description = description;
        if (category !== undefined) portfolio.category = category;
        if (eventDate !== undefined) portfolio.eventDate = eventDate;
        if (location !== undefined) portfolio.location = location;

        if (req.files?.coverImage?.length) {
            const oldId = getPublicIdFromUrl(portfolio.coverImage);
            const result = await uploadFile(req.files.coverImage[0], "friends-photography/portfolio");
            portfolio.coverImage = result.secure_url;
            if (oldId) await deleteFile(oldId).catch(() => {});
        }

        if (req.files?.images?.length) {
            const results = await Promise.all(req.files.images.map((file) => uploadFile(file, "friends-photography/portfolio")));
            portfolio.images = [...portfolio.images, ...results.map((item) => item.secure_url)];
        }

        await portfolio.save();
        return res.status(200).json({ success: true, message: "Portfolio updated successfully", data: portfolio });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deletePortfolio = async (req, res) => {
    try {
        const portfolio = await portfolioModel.findByIdAndDelete(req.params.id);
        if (!portfolio) return res.status(404).json({ success: false, message: "Portfolio not found" });

        const ids = [portfolio.coverImage, ...(portfolio.images || [])].map(getPublicIdFromUrl).filter(Boolean);
        await Promise.all(ids.map((id) => deleteFile(id).catch(() => null)));

        return res.status(200).json({ success: true, message: "Portfolio deleted successfully", data: portfolio });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPortfolio, getAllPortfolios, getPortfolioById, updatePortfolio, deletePortfolio };
