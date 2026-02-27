// const express=require("express")
// const router=express.Router()
// const authMiddleware=require("../middleware/authMiddleware")
// router.get("/profile",authMiddleware,(req,res)=>{
//     res.json({"message":"protected data to be accessed successfully",
//         user:req.user})
// })
// module.exports=router
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Jobseeker = require("../models/JobSeeker")
const authMiddleware = require("../middleware/authMiddleware")
const { getGfsBucket, uploadProfilePic, uploadResume } = require('../utils/Gridfs')

//to delete gridfs files by objId
const deleteFromGridFS = async (fileId) => {
    if (!fileId) return
    try {
        await getGfsBucket().delete(new mongoose.Types.ObjectId(fileId))
    } catch (err) {
        console.log("GridFS delete warning (file may not exist):", err.message)
    }
}
//these all have this start /api/jobseeker/

router.put("/profile", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "JobSeeker not found" })

        const { name, mobileNumber, address, skills, experience } = req.body

        if (name !== undefined) user.name = name
        if (mobileNumber !== undefined) user.mobileNumber = mobileNumber
        if (address !== undefined) user.address = address
        if (skills !== undefined) user.skills = skills
        if (experience !== undefined) user.experience = experience

        await user.save()

        res.json({ message: "Profile updated successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Profile update failed" })
    }
})

router.get("/profile", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id).select("-password -verificationOtp -resetOtp -resetOtpExpire -otpExpires ")
        if (!user) return res.status(404).json({ message: "jobseeker not found" })
        res.status(200).json({
            message: "Profile fetched successfully",
            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                address: user.address,
                gender: user.gender,
                skills: user.skills,
                education: user.education,
                experience: user.experience,
                hasProfilePic: !!user.profilePicId,
                hasResume: !!user.resumeId,
                resumeFilename: user.resumeFilename,
                createdAt: user.createdAt,
            },
        })
    }
    catch (err) {
        console.log("error while fetching the profile", err)
        res.status(500).json({ message: "failed to fetch profile" })
    }
})
// educations details
router.post("/education", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const { degree, institution, percentage, yearOfPassing } = req.body
        const user = await Jobseeker.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "jobseeker not found " })
        user.education.push({ degree, institution, percentage, yearOfPassing })
        await user.save()
        res.status(200).json({ message: "education added successfully" })
    }
    catch (err) {
        console.log("error while adding education", err)
        res.status(500).json({ message: "failed to add education" })
    }
})
// to update education
router.put("/education/:eduId", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "JobSeeker not found" })

        const edu = user.education.id(req.params.eduId)
        if (!edu) return res.status(404).json({ message: "Education entry not found" })

        const { degree, institution, percentage, yearOfPassing } = req.body
        if (degree) edu.degree = degree
        if (institution) edu.institution = institution
        if (percentage !== undefined) edu.percentage = percentage
        if (yearOfPassing !== undefined) edu.yearOfPassing = yearOfPassing

        await user.save()
        res.status(200).json({ message: "Education updated successfully", education: user.education })
    } catch (error) {
        console.log("Error updating education:", error)
        res.status(500).json({ message: "Failed to update education" })
    }
})
//delete education details
router.delete("/education/:eduId", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "JobSeeker not found" })

        const edu = user.education.id(req.params.eduId)
        if (!edu) return res.status(404).json({ message: "Education entry not found" })

        edu.deleteOne()
        await user.save()

        res.status(200).json({ message: "Education deleted successfully", education: user.education })
    } catch (error) {
        console.log("Error deleting education:", error)
        res.status(500).json({ message: "Failed to delete education" })
    }
})
//update profile pic
router.post(
    "/upload-profile-pic",
    authMiddleware(["jobseeker"]),
    (req, res, next) => {
        uploadProfilePic.single("profilePic")(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message })
            next()
        })
    },
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" })

            const user = await Jobseeker.findById(req.user.id)
            if (!user) return res.status(404).json({ message: "JobSeeker not found" })

            // Delete old profile pic from GridFS if exists
            if (user.profilePicId) await deleteFromGridFS(user.profilePicId)

            user.profilePicId = req.file.id
            await user.save()

            res.status(200).json({ message: "Profile picture uploaded successfully" })
        } catch (error) {
            console.log("Error uploading profile pic:", error)
            res.status(500).json({ message: "Failed to upload profile picture" })
        }
    }
)
// see profile pic 
router.get("/profile-pic", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id).select("profilePicId")
        if (!user || !user.profilePicId)
            return res.status(404).json({ message: "No profile picture found" })

        const bucket = getGfsBucket()
        const fileId = new mongoose.Types.ObjectId(user.profilePicId)

        const files = await bucket.find({ _id: fileId }).toArray()
        if (!files.length)
            return res.status(404).json({ message: "File not found in storage" })

        res.set("Content-Type", files[0].metadata?.mimetype || "image/jpeg")

        const downloadStream = bucket.openDownloadStream(fileId)
        downloadStream.on("error", () => res.status(500).json({ message: "Error streaming file" }))
        downloadStream.pipe(res)
    } catch (error) {
        console.log("Error fetching profile pic:", error)
        res.status(500).json({ message: "Failed to fetch profile picture" })
    }
})
// delete profile pic
router.delete("/profile-pic", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id)
        if (!user || !user.profilePicId)
            return res.status(404).json({ message: "No profile picture found" })

        await deleteFromGridFS(user.profilePicId)
        user.profilePicId = null
        await user.save()

        res.status(200).json({ message: "Profile picture deleted successfully" })
    } catch (error) {
        console.log("Error deleting profile pic:", error)
        res.status(500).json({ message: "Failed to delete profile picture" })
    }
})
// update resume
router.post(
    "/upload-resume",
    authMiddleware(["jobseeker"]),
    (req, res, next) => {
        uploadResume.single("resume")(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message })
            next()
        })
    },
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" })

            const user = await Jobseeker.findById(req.user.id)
            if (!user) return res.status(404).json({ message: "JobSeeker not found" })

            // Delete old resume from GridFS if exists
            if (user.resumeId) await deleteFromGridFS(user.resumeId)

            user.resumeId = req.file.id
            user.resumeFilename = req.file.originalname
            await user.save()

            res.status(200).json({
                message: "Resume uploaded successfully",
                filename: req.file.originalname,
            })
        } catch (error) {
            console.log("Error uploading resume:", error)
            res.status(500).json({ message: "Failed to upload resume" })
        }
    }
)
// see resume
router.get("/resume", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id).select("resumeId resumeFilename")
        if (!user || !user.resumeId)
            return res.status(404).json({ message: "No resume found" })

        const bucket = getGfsBucket()
        const fileId = new mongoose.Types.ObjectId(user.resumeId)

        const files = await bucket.find({ _id: fileId }).toArray()
        if (!files.length)
            return res.status(404).json({ message: "File not found in storage" })

        res.set("Content-Type", "application/pdf")
        res.set("Content-Disposition", `inline; filename="${user.resumeFilename || "resume.pdf"}"`)

        const downloadStream = bucket.openDownloadStream(fileId)
        downloadStream.on("error", () => res.status(500).json({ message: "Error streaming file" }))
        downloadStream.pipe(res)
    } catch (error) {
        console.log("Error fetching resume:", error)
        res.status(500).json({ message: "Failed to fetch resume" })
    }
})
//to delete resume
router.delete("/resume", authMiddleware(["jobseeker"]), async (req, res) => {
    try {
        const user = await Jobseeker.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "JobSeeker not found" })

        if (!user.resumeId)
            return res.status(404).json({ message: "No resume to delete" })

        await deleteFromGridFS(user.resumeId)
        user.resumeId = null
        user.resumeFilename = null
        await user.save()

        res.status(200).json({ message: "Resume deleted successfully" })
    } catch (error) {
        console.log("Error deleting resume:", error)
        res.status(500).json({ message: "Failed to delete resume" })
    }
})
module.exports = router