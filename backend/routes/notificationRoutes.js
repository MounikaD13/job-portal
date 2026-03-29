const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const authMiddleware = require("../middleware/authMiddleware")

// GET /api/notifications
// Fetch notifications for the logged-in job seeker
router.get("/", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20) // Limit to recent 20 notifications
        
        res.status(200).json({ notifications })
    } catch (err) {
        console.error("Failed to fetch notifications:", err)
        res.status(500).json({ message: "Failed to fetch notifications" })
    }
})

// PUT /api/notifications/:id/read
// Mark a notification as read
router.put("/:id/read", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" })
        }
        
        // Ensure the notification belongs to this user
        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this notification" })
        }

        notification.isRead = true
        await notification.save()

        res.status(200).json({ message: "Notification marked as read", notification })
    } catch (err) {
        console.error("Failed to update notification:", err)
        res.status(500).json({ message: "Failed to mark notification as read" })
    }
})

module.exports = router
