const mongoose = require("mongoose")
const recruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyAddress: {
        type: String,
        required: true,
        trim: true
    },
    companyWebsite: String,
    industry: String,
    companySize: String,
    aboutCompany: String,
    country: String,
    state: String,
    city: String,
    linkedin: {
        type: String
    },
    // GridFS File IDs

    profilePicId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    companyLogoId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    resetOtp: String,
    resetOtpExpire: Date,
    verificationOtp: String,
    otpExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Recruiter", recruiterSchema)