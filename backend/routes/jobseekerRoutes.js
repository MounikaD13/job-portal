const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Jobseeker = require("../models/JobSeeker")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const { initGridFS,
    getBucket,
    uploadToGridFS } = require("../utils/gridFsUpload")

// //to delete gridfs files by objId
// const deleteFromGridFS = async (fileId) => {
//     if (!fileId) return
//     try {
//         await getGfsBucket().delete(new mongoose.Types.ObjectId(fileId))
//     } catch (err) {
//         console.log("GridFS delete warning (file may not exist):", err.message)
//     }
// }
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
    upload.single("profilePic"),
    async (req, res) => {
        try {
            const user = await Jobseeker.findById(req.user.id)
            if (!req.file)
                return res.status(400).json({ message: "No file" })
            // delete old
            if (user.profilePicId) {
                await getBucket().delete(user.profilePicId)
            }
            const fileId =
                await uploadToGridFS(req.file, "profilePic", req.user.id)
            user.profilePicId = fileId
            await user.save()
            res.json({ message: "Profile pic uploaded" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Upload failed" })
        }
    })
// see profile pic 
router.get(
    "/profile-pic",
    authMiddleware(["jobseeker"]),
    async (req, res) => {
        try {
            const user =
                await Jobseeker.findById(req.user.id).select("profilePicId")
            if (!user || !user.profilePicId)
                return res.status(404).json({ message: "No profile picture" })
            const bucket = getBucket()
            const fileId = new mongoose.Types.ObjectId(user.profilePicId)
            const files =
                await bucket.find({ _id: fileId }).toArray()
            if (!files.length)
                return res.status(404).json({ message: "File not found" })
            // ✅ important
            res.set("Content-Type", files[0].contentType || "image/jpeg")
            bucket.openDownloadStream(fileId).pipe(res)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Failed to fetch" })
        }
    })
// delete profile pic
router.delete(
    "/profile-pic",
    authMiddleware(["jobseeker"]),
    async (req, res) => {
        try {

            const user =
                await Jobseeker.findById(req.user.id)

            if (!user.profilePicId)
                return res.status(404)
                    .json({ message: "No profile pic" })

            await getBucket()
                .delete(
                    new mongoose.Types.ObjectId(
                        user.profilePicId
                    )
                )

            user.profilePicId = null
            await user.save()

            res.json({
                message: "Profile picture deleted"
            })

        } catch (err) {
            console.log(err)
            res.status(500)
                .json({ message: "Delete failed" })
        }
    })
// update resume
router.post(
    "/upload-resume",
    authMiddleware(["jobseeker"]),
    upload.single("resume"),
    async (req, res) => {

        const user =
            await Jobseeker.findById(req.user.id)

        if (user.resumeId) {
            await getBucket()
                .delete(user.resumeId)
        }

        const fileId =
            await uploadToGridFS(
                req.file,
                "resume",
                req.user.id
            )

        user.resumeId = fileId
        user.resumeFilename = req.file.originalname

        await user.save()

        res.json({ message: "Resume uploaded" })
    })
// see resume
router.get(
    "/resume",
    authMiddleware(["jobseeker"]),
    async (req, res) => {
        try {

            const user =
                await Jobseeker
                    .findById(req.user.id)
                    .select("resumeId resumeFilename")

            if (!user || !user.resumeId)
                return res.status(404)
                    .json({ message: "No resume" })

            const bucket = getBucket()

            const fileId =
                new mongoose.Types.ObjectId(
                    user.resumeId
                )

            res.set(
                "Content-Type",
                "application/pdf"
            )

            res.set(
                "Content-Disposition",
                `inline; filename="${user.resumeFilename}"`
            )

            bucket
                .openDownloadStream(fileId)
                .pipe(res)

        } catch (err) {
            console.log(err)
            res.status(500)
                .json({ message: "Fetch failed" })
        }
    })
//to delete resume
router.delete(
    "/resume",
    authMiddleware(["jobseeker"]),
    async (req, res) => {
        try {

            const user =
                await Jobseeker.findById(req.user.id)

            if (!user.resumeId)
                return res.status(404)
                    .json({ message: "No resume" })

            await getBucket()
                .delete(
                    new mongoose.Types.ObjectId(
                        user.resumeId
                    )
                )

            user.resumeId = null
            user.resumeFilename = null

            await user.save()

            res.json({
                message: "Resume deleted"
            })

        } catch (err) {
            console.log(err)
            res.status(500)
                .json({ message: "Delete failed" })
        }
    })
module.exports = router