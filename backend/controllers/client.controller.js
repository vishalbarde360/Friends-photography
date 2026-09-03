const clientModel = require("../models/client.model.js");



const createClient = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        console.log("REQ USER:", req.user);

        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Admin access required",
            });
        }

        const {
            name,
            email,
            phone,
            address,
            notes
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !address || !notes) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create client
        const client = await clientModel.create({
            name,
            email,
            phone,
            address,
            notes,
        });
        console.log("client created")
        return res.status(201).json({
            success: true,
            message: "Client created successfully",
            client,
        });

    } catch (error) {
        console.error("CREATE CLIENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllClients = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const clients = await clientModel.find();
        return res.status(200).json({
            success: true,
            message: "Clients fetched successfully",
            clients,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const client = await clientModel.findById(id);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });
        return res.status(200).json({
            success: true,
            message: "Client fetched successfully",
            client,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const updateClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, notes } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!name || !email || !phone || !address || !notes) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const client = await clientModel.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            address,
            notes,
        }, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            message: "Client updated successfully",
            client,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
const deleleClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const client = await clientModel.findByIdAndDelete(id);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });
        return res.status(200).json({
            success: true,
            message: "Client deleted successfully",
            client,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClientById,
    deleleClientById
}