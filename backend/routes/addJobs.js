const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Job = require("../models/Jobs")
const JobSeeker = require("../models/JobSeeker")
const Notification = require("../models/Notification")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const { getBucket, uploadToGridFS } = require("../utils/gridFsUpload")

// GET /api/jobs
// Fetch all jobs (All logged-in users)
router.get("/", authMiddleware([]), async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 })
        res.status(200).json({ jobs })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch jobs" })
    }
})

// POST /api/jobs/upload-logo
// Upload a company logo for a job (Recruiter only) — returns fileId
router.post("/upload-logo", authMiddleware(["recruiter"]), upload.single("companyLogo"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" })
        const fileId = await uploadToGridFS(req.file, "jobLogo", req.user.id)
        res.status(200).json({ fileId })
    } catch (err) {
        console.error("Logo upload failed:", err)
        res.status(500).json({ message: "Logo upload failed" })
    }
})

// GET /api/jobs/logo/:fileId
// Serve a company logo image by its GridFS file ID (public)
router.get("/logo/:fileId", async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.fileId)
        const bucket = getBucket()
        const files = await bucket.find({ _id: fileId }).toArray()
        if (!files.length) return res.status(404).json({ message: "Logo not found" })
        res.set("Content-Type", files[0].contentType || "image/png")
        bucket.openDownloadStream(fileId).pipe(res)
    } catch (err) {
        console.error("Logo fetch failed:", err)
        res.status(500).json({ message: "Failed to fetch logo" })
    }
})

// POST /api/jobs
// Add a new job (Recruiter only)
router.post("/", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const { title, description, companyName, location, jobType, salary, experienceRequired, skillsRequired, companyLogoId } = req.body
        if (!title || !description || !companyName || !location || !jobType || experienceRequired === undefined) {
            return res.status(400).json({ message: "Please provide all required fields" })
        }
        const newJob = new Job({
            title,
            description,
            companyName,
            location,
            jobType,
            salary,
            experienceRequired,
            skillsRequired,
            companyLogoId: companyLogoId || null,
            recruiterId: req.user.id
        })
        await newJob.save()

        // Trigger notifications for matched job seekers
        if (skillsRequired && skillsRequired.length > 0) {
            try {
                // Determine matches based on case-insensitive regex if possible, but $in works for exact match
                // We'll use a simple $in to match any of the skills given.
                const caseInsensitiveSkills = skillsRequired.map(skill => new RegExp('^' + skill + '$', 'i'))

                const matchedSeekers = await JobSeeker.find({
                    skills: { $in: caseInsensitiveSkills }
                })

                if (matchedSeekers.length > 0) {
                    const notifications = matchedSeekers.map(seeker => ({
                        userId: seeker._id,
                        jobId: newJob._id,
                        message: `New job matching your skills: ${title} at ${companyName}`
                    }))

                    await Notification.insertMany(notifications)
                }
            } catch (notifErr) {
                console.error("Failed to create notifications:", notifErr)
            }
        }

        res.status(201).json({ message: "Job added successfully", job: newJob })
    } catch (err) {
        console.error("Failed to create job:", err)
        res.status(500).json({ message: "Failed to add job" })
    }
})

// GET /api/jobs/my-jobs
// Fetch jobs posted by the logged-in recruiter
router.get("/my-jobs", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ jobs })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch jobs" })
    }
})

// PUT /api/jobs/:id
// Update a job
router.put("/:id", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        // Restrict editing only to job owner
        if (job.recruiterId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to edit this job" })
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        res.status(200).json({ message: "Job updated successfully", job: updatedJob })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to update job" })
    }
})

// DELETE /api/jobs/:id
// Delete a job
router.delete("/:id", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        if (job.recruiterId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this job" })
        }

        await Job.findByIdAndDelete(req.params.id)

        // Also delete any notifications related to this job
        await Notification.deleteMany({ jobId: req.params.id })

        res.status(200).json({ message: "Job deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to delete job" })
    }
})

// GET /api/jobs/:id
// Fetch a single job by ID (All logged-in users)
router.get("/:id", authMiddleware([]), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }
        res.status(200).json({ job })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch job" })
    }
})

module.exports = router