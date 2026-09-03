const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://bardevishal92_db_user:sfRz4tUn96vycWMQ@cluster0.nfbazdm.mongodb.net/friends-photography")
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB