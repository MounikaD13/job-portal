const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Recruiter = require("../models/Recruiter")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const {
    getBucket,
    uploadToGridFS
} = require("../utils/gridFsUpload")

// UPDATE PROFILE
router.put("/profile", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const user = await Recruiter.findById(req.user.id)
        if (!user)
            return res.status(404).json({ message: "Recruiter not found" })
        const {
            name,
            mobileNumber,
            companyAddress,
            companyWebsite,
            industry,
            companySize,
            aboutCompany,
            country,
            state,
            city,
            linkedin
        } = req.body
        if (name !== undefined) user.name = name
        if (mobileNumber!== undefined) user.mobileNumber= mobileNumber
        if (companyAddress !== undefined) user.companyAddress = companyAddress
        if (companyWebsite !== undefined) user.companyWebsite = companyWebsite
        if (industry !== undefined) user.industry = industry
        if (companySize !== undefined) user.companySize = companySize
        if (aboutCompany !== undefined) user.aboutCompany = aboutCompany
        if (country !== undefined) user.country = country
        if (state !== undefined) user.state = state
        if (city !== undefined) user.city = city
        if (linkedin !== undefined) user.linkedin = linkedin
        await user.save()
        res.json({ message: "Recruiter profile updated successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Profile update failed" })
    }
})

// GET PROFILE
router.get("/profile", authMiddleware(["recruiter"]), async (req, res) => {
    try {
        const user = await Recruiter
            .findById(req.user.id)
           .select("-password -verificationOtp -resetOtp -resetOtpExpire -otpExpires")
        if (!user)
            return res.status(404).json({ message: "Recruiter not found" })
        res.status(200).json({
            message: "Profile fetched successfully",
            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                companyName: user.companyName,
                companyAddress:user.companyAddress,
                companyWebsite: user.companyWebsite,
                industry: user.industry,
                companySize: user.companySize,
                aboutCompany: user.aboutCompany,
                country: user.country,
                state: user.state,
                city: user.city,
                linkedin: user.linkedin,
                hasProfilePic: !!user.profilePicId,
                hasCompanyLogo: !!user.companyLogoId,
                createdAt: user.createdAt
            }
        })
    }
    catch (err) {
        console.log("error fetching recruiter profile", err)
        res.status(500).json({ message: "Failed to fetch profile" })
    }
})

// UPLOAD PROFILE PIC
router.post(
    "/upload-profile-pic",
    authMiddleware(["recruiter"]),
    upload.single("profilePic"),
    async (req, res) => {
        try {
            const user = await Recruiter.findById(req.user.id)
            if (!req.file)
                return res.status(400).json({ message: "No file uploaded" })
            if (user.profilePicId)
                await getBucket().delete(user.profilePicId)
            const fileId =
                await uploadToGridFS(req.file, "profilePic", req.user.id)
            user.profilePicId = fileId
            await user.save()
            res.json({ message: "Profile picture uploaded" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Upload failed" })
        }
    }
)

// GET PROFILE PIC
router.get(
    "/profile-pic",
    authMiddleware(["recruiter"]),
    async (req, res) => {
        try {
            const user =
                await Recruiter
                    .findById(req.user.id)
                    .select("profilePicId")
            if (!user || !user.profilePicId)
                return res.status(404).json({ message: "No profile picture" })
            const bucket = getBucket()
            const fileId =
                new mongoose.Types.ObjectId(user.profilePicId)
            const files =
                await bucket.find({ _id: fileId }).toArray()
            if (!files.length)
                return res.status(404).json({ message: "File not found" })
            res.set("Content-Type", files[0].contentType || "image/jpeg")
            bucket
                .openDownloadStream(fileId)
                .pipe(res)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Failed to fetch profile picture" })
        }
    }
)

// DELETE PROFILE PIC
router.delete(
    "/profile-pic",
    authMiddleware(["recruiter"]),
    async (req, res) => {
        try {
            const user = await Recruiter.findById(req.user.id)
            if (!user.profilePicId)
                return res.status(404).json({ message: "No profile picture" })
            await getBucket()
                .delete(new mongoose.Types.ObjectId(user.profilePicId))
            user.profilePicId = null
            await user.save()
            res.json({ message: "Profile picture deleted" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Delete failed" })
        }
    }
)

// UPLOAD COMPANY LOGO
router.post(
    "/upload-company-logo",
    authMiddleware(["recruiter"]),
    upload.single("companyLogo"),
    async (req, res) => {
        try {
            const user = await Recruiter.findById(req.user.id)
            if (!req.file)
                return res.status(400).json({ message: "No file uploaded" })
            if (user.companyLogoId)
                await getBucket().delete(user.companyLogoId)
            const fileId =
                await uploadToGridFS(req.file, "companyLogo", req.user.id)
            user.companyLogoId = fileId
            await user.save()
            res.json({ message: "Company logo uploaded" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Upload failed" })
        }
    }
)

// GET COMPANY LOGO
router.get(
    "/company-logo",
    authMiddleware(["recruiter"]),
    async (req, res) => {
        try {
            const user =
                await Recruiter
                    .findById(req.user.id)
                    .select("companyLogoId")
            if (!user || !user.companyLogoId)
                return res.status(404).json({ message: "No company logo" })
            const bucket = getBucket()
            const fileId =
                new mongoose.Types.ObjectId(user.companyLogoId)
            const files =
                await bucket.find({ _id: fileId }).toArray()
            if (!files.length)
                return res.status(404).json({ message: "File not found" })
            res.set("Content-Type", files[0].contentType || "image/png")
            bucket
                .openDownloadStream(fileId)
                .pipe(res)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Failed to fetch company logo" })
        }
    }
)

// DELETE COMPANY LOGO
router.delete(
    "/company-logo",
    authMiddleware(["recruiter"]),
    async (req, res) => {
        try {
            const user = await Recruiter.findById(req.user.id)
            if (!user.companyLogoId)
                return res.status(404).json({ message: "No company logo" })
            await getBucket()
                .delete(new mongoose.Types.ObjectId(user.companyLogoId))
            user.companyLogoId = null
            await user.save()
            res.json({ message: "Company logo deleted" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Delete failed" })
        }
    }
)

module.exports = router