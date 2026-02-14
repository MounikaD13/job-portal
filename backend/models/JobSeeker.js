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
    profilePicId:{
        type:mongoose.Schema.Types.ObjectId
    },
    resumeId:{
       type:mongoose.Schema.Types.ObjectId
    },
    resetOtp:String,
    resetOtpExpire:Date,
    verificationOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
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
