const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Jobs");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { getBucket, uploadToGridFS } = require("../utils/gridFsUpload");

// GET /api/applications/resume/:resumeId
// Serve a resume file by its GridFS ID
router.get("/resume/:resumeId", async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.resumeId);
        const bucket = getBucket();
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files.length) return res.status(404).json({ message: "Resume not found" });
        res.set("Content-Type", files[0].contentType || "application/pdf");
        bucket.openDownloadStream(fileId).pipe(res);
    } catch (err) {
        console.error("Resume fetch failed:", err);
        res.status(500).json({ message: "Failed to fetch resume" });
    }
});

// POST /api/applications/apply/:jobId
// Submit a job application (Job Seeker only)
router.post("/apply/:jobId", authMiddleware(["jobseeker"]), upload.single("resume"), async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;
        const jobSeekerId = req.user.id;

        // Check if already applied
        const existingApp = await Application.findOne({ jobId, jobSeekerId });
        if (existingApp) return res.status(400).json({ message: "You have already applied for this job" });

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        let resumeId = null;
        if (req.file) {
            resumeId = await uploadToGridFS(req.file, "resume", jobSeekerId);
        }

        const newApplication = new Application({
            jobId,
            jobSeekerId,
            recruiterId: job.recruiterId,
            resumeId,
            coverLetter: coverLetter || "",
            status: "pending"
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    } catch (err) {
        console.error("Application failed:", err);
        res.status(500).json({ message: "Failed to submit application" });
    }
});

// GET /api/applications/my-applications
// Get all jobs a seeker has applied to
router.get("/my-applications", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const applications = await Application.find({ jobSeekerId: req.user.id })
            .populate("jobId")
            .sort({ createdAt: -1 });
        res.status(200).json({ applications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});

// GET /api/applications/job/:jobId
// Get all applications for a specific job (Recruiter only)
router.get("/job/:jobId", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId, recruiterId: req.user.id })
            .populate("jobSeekerId", "name email") // Assuming User model has name and email
            .sort({ createdAt: -1 });
        res.status(200).json({ applications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});

// PUT /api/applications/status/:id
// Update application status (Recruiter only)
router.put("/status/:id", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, recruiterId: req.user.id },
            { status },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Application not found or unauthorized" });
        res.status(200).json({ message: "Status updated successfully", application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
});

module.exports = router;
