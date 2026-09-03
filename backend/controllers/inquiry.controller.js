const inquiryModel = require("../models/inquiry.model.js");

const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, eventType, eventDate, location, budget, message } = req.body;
        if (!name || !email || !phone || !eventType || !eventDate || !location || !message) {
            return res.status(400).json({ success: false, message: "All required fields are required" });
        }
        const inquiry = await inquiryModel.create({ name, email, phone, eventType, eventDate, location, budget, message, status: "New" });
        return res.status(201).json({ success: true, message: "Inquiry created successfully", data: inquiry });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const getInquiryById = async (req, res) => {
    try {
        const inquiry = await inquiryModel.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
        return res.status(200).json({ success: true, data: inquiry });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const updateInquiry = async (req, res) => {
    try {
        const allowed = ["name", "email", "phone", "eventType", "eventDate", "location", "budget", "message", "status"];
        const updates = {};
        allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
        const inquiry = await inquiryModel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
        return res.status(200).json({ success: true, message: "Inquiry updated successfully", data: inquiry });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await inquiryModel.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
        return res.status(200).json({ success: true, message: "Inquiry deleted successfully", data: inquiry });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { createInquiry, getAllInquiries, getInquiryById, updateInquiry, deleteInquiry };
