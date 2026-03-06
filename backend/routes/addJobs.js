const express = require("express")
const router = express.Router()
const Job = require("../models/Jobs")
const authMiddleware = require("../middleware/authMiddleware")

// POST /api/jobs
// Add a new job (Recruiter only)
router.post("/", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const { title, description, companyName, location, jobType, salary, experienceRequired, skillsRequired } = req.body
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
            recruiterId: req.user.id
        })
        await newJob.save()
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
        res.status(200).json({ message: "Job deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to delete job" })
    }
})

module.exports = router