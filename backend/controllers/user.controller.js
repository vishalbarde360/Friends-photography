const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {
    validateEmail,
    validateName,
    validatePassword,
    validateSetupKey,
    validateMongoId,
} = require("../services/validator")


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const nameCheck = validateName(name)
        if (!nameCheck.valid) {
            return res.status(400).json({ success: false, message: nameCheck.message })
        }

        const emailCheck = validateEmail(email)
        if (!emailCheck.valid) {
            return res.status(400).json({ success: false, message: emailCheck.message })
        }

        const passwordCheck = validatePassword(password)
        if (!passwordCheck.valid) {
            return res.status(400).json({ success: false, message: passwordCheck.message })
        }

        const cleanName = nameCheck.value
        const cleanEmail = emailCheck.value
        const cleanPassword = passwordCheck.value

        const userExists = await userModel.findOne({ email: cleanEmail })
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10)

        // Role is never taken from the request — every public sign-up is a
        // plain "user". Admin accounts can only be created via setupAdmin,
        // which is gated behind a server-side secret key.
        const user = await userModel.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: "user",
        })
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
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

        const setupKeyCheck = validateSetupKey(setupKey)
        if (!setupKeyCheck.valid) {
            return res.status(400).json({ success: false, message: setupKeyCheck.message })
        }
        if (setupKeyCheck.value !== process.env.ADMIN_SETUP_KEY) {
            return res.status(403).json({ success: false, message: "Invalid setup key" })
        }

        const nameCheck = validateName(name)
        if (!nameCheck.valid) {
            return res.status(400).json({ success: false, message: nameCheck.message })
        }

        const emailCheck = validateEmail(email)
        if (!emailCheck.valid) {
            return res.status(400).json({ success: false, message: emailCheck.message })
        }

        const passwordCheck = validatePassword(password)
        if (!passwordCheck.valid) {
            return res.status(400).json({ success: false, message: passwordCheck.message })
        }

        const cleanName = nameCheck.value
        const cleanEmail = emailCheck.value
        const cleanPassword = passwordCheck.value

        const userExists = await userModel.findOne({ email: cleanEmail })
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10)
        const user = await userModel.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: "admin",
        })
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const emailCheck = validateEmail(email)
        if (!emailCheck.valid) {
            return res.status(400).json({ success: false, message: emailCheck.message })
        }
        // For login we only enforce "is it a non-empty string" — a lenient
        // check here on purpose so we never leak password-policy hints to
        // an attacker via error messages during login. Strength rules apply
        // only at registration time.
        if (typeof password !== "string" || password.length === 0 || password.length > 128) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const cleanEmail = emailCheck.value

        const user = await userModel.findOne({ email: cleanEmail })
        if (!user) {
            // Same generic message as a wrong password, to avoid
            // user-enumeration via distinct error messages.
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
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
        const idCheck = validateMongoId(req.params.id)
        if (!idCheck.valid) {
            return res.status(400).json({ success: false, message: idCheck.message })
        }
        const user = await userModel.findById(idCheck.value)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const deleteUser = async (req, res) => {
    try {
        const idCheck = validateMongoId(req.params.id)
        if (!idCheck.valid) {
            return res.status(400).json({ success: false, message: idCheck.message })
        }
        const user = await userModel.findByIdAndDelete(idCheck.value)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


module.exports = { registerUser, setupAdmin, loginUser, logoutUser, getCurrentUser, getAllUsers, getUserById, deleteUser }