const Event = require("../models/event.model");
const Client = require("../models/client.model");

const createEvent = async (req, res) => {
    try {
        const { clientId, title, eventType, eventDate, location, package: eventPackage, status } = req.body;
        if (!clientId || !title || !eventType || !eventDate || !location) return res.status(400).json({ success: false, message: "clientId, title, eventType, eventDate and location are required" });
        if (!await Client.findById(clientId)) return res.status(404).json({ success: false, message: "Client not found" });
        const event = await Event.create({ clientId, title, eventType, eventDate, location, package: eventPackage, status });
        return res.status(201).json({ success: true, message: "Event created successfully", data: event });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("clientId", "name email phone").sort({ eventDate: 1 });
        return res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("clientId", "name email phone");
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        return res.status(200).json({ success: true, data: event });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const updateEvent = async (req, res) => {
    try {
        const allowed = ["clientId", "title", "eventType", "eventDate", "location", "package", "status"];
        const updates = {};
        allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
        if (updates.clientId && !await Client.findById(updates.clientId)) return res.status(404).json({ success: false, message: "Client not found" });
        const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        return res.status(200).json({ success: true, message: "Event updated successfully", data: event });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        return res.status(200).json({ success: true, message: "Event deleted successfully", data: event });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
