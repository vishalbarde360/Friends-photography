const mongoose = require("mongoose")


const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true
    }, phone: {
        type: String,
        required: true
    }, eventType: {
        type: String,
        required: true
    }, eventDate: {
        type: Date,
        required: true
    }, location: {
        type: String,
        required: true
    }, budget: {
        type: String,
        required: true
    }, message: {
        type: String,
        required: true
    }, status: {
        type: String,
        enum: ["New", "Contacted", "Discussion", "Confirmed", "Rejected", "Completed"],
        default: "New"
    }
})

const inquiryModel = mongoose.model("Inquiry", inquirySchema)

module.exports = inquiryModel