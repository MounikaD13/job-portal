const mongoose = require("mongoose")
const educationSchema = mongoose.Schema({
    degree: String,
    institution: String,
    percentage: String,
    yearOfPassing: Number,
});
const jobSeekerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
    address: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    skills: [String],
    education: [educationSchema],
    experience: {
        type: Number,
        default: 0,
    },
    //gridfs file ids
    profilePicId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    resumeId: {
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

module.exports = mongoose.model("JobSeeker", jobSeekerSchema)
