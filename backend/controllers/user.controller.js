const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Role is never taken from the request — every public sign-up is a
        // plain "user". Admin accounts can only be created via setupAdmin,
        // which is gated behind a server-side secret key.
        const user = await userModel.create({ name, email, password: hashedPassword, role: "user" })
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const setupAdmin = async (req, res) => {
    try {
        const { name, email, password, setupKey } = req.body

        if (!process.env.ADMIN_SETUP_KEY) {
            return res.status(500).json({ success: false, message: "Admin setup is not configured on the server" })
        }
        if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
            return res.status(403).json({ success: false, message: "Invalid setup key" })
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ name, email, password: hashedPassword, role: "admin" })
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" })
        }
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ success: true, message: "User logged out successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json({ success: true, data: users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}




const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


module.exports = { registerUser, setupAdmin, loginUser, logoutUser, getCurrentUser, getAllUsers, getUserById, deleteUser }