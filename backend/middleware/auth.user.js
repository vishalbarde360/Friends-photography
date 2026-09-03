const jwt = require("jsonwebtoken");
const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
module.exports = authUser;
