const dotenv = require("dotenv");

// .env सर्वात आधी load करा
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./db/db");

const userRouter = require("./routes/user.route.js");
const portfolioRouter = require("./routes/portfolio.route.js");
const clientRouter = require("./routes/client.route.js");
const inquiryRouter = require("./routes/inquiry.route.js");
const eventRouter = require("./routes/event.route.js");
const albumRouter = require("./routes/album.route.js");
const photoRouter = require("./routes/photo.route.js");
const galleryRouter = require("./routes/gallery.route.js");

const app = express();


// =======================
// Middleware
// =======================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());


// =======================
// Database
// =======================

connectDB();


// =======================
// Test Route
// =======================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Friends Photography API is running"
    });
});


// =======================
// Routes
// =======================

app.use("/api/user", userRouter);
app.use("/api/auth", userRouter);

app.use("/api/portfolio", portfolioRouter);

app.use("/api/client", clientRouter);
app.use("/api/clients", clientRouter);

app.use("/api/inquiry", inquiryRouter);
app.use("/api/inquiries", inquiryRouter);

app.use("/api/event", eventRouter);
app.use("/api/events", eventRouter);

app.use("/api/album", albumRouter);
app.use("/api/albums", albumRouter);

app.use("/api/photo", photoRouter);
app.use("/api/photos", photoRouter);

app.use("/api/gallery", galleryRouter);


// =======================
// Error Handler
// =======================

app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});


// =======================
// Server
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    console.log(
        "JWT_SECRET:",
        process.env.JWT_SECRET ? "LOADED" : "MISSING"
    );
});