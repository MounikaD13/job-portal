const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "accepted", "rejected"],
            default: "pending",
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId, // GridFS file ID
            default: null,
        },
        coverLetter: {
            type: String,
            default: "",
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
