const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const JobSeeker = require("../models/JobSeeker")
const Recruiter = require("../models/Recruiter")
const Admin = require("../models/Admin")
const transporter = require("../utils/mail")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")
// Helper function to get the appropriate model based on role
const getModel = (role) => {
    if (role === "jobseeker") return JobSeeker
    if (role === "recruiter") return Recruiter
    if (role == "admin") return Admin
    return null
}

// Send OTP to email
router.post("/send-otp", async (req, res) => {
    try {
        const { email, role } = req.body

        if (!email || !role) {
            return res.status(400).json({ "message": "Email and role are required" })
        }

        const Model = getModel(role)
        if (!Model) {
            return res.status(400).json({ "message": "Invalid role" })
        }

        // Check if user already registered
        const existingUser = await Model.findOne({ email })
        if (existingUser && existingUser.isVerified) {
            return res.status(409).json({ "message": "Email already registered" })
        }

        // Generate 5-digit OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString()

        // Save or update OTP in database
        if (existingUser) {
            existingUser.verificationOtp = otp
            existingUser.otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
            await existingUser.save()
        } else {
            const tempUser = new Model({
                email,
                verificationOtp: otp,
                otpExpires: Date.now() + 10 * 60 * 1000,
                // Temporary placeholder values
                name: "temp",
                password: "temp",
                mobileNumber: "temp",
                ...(role === "jobseeker"
                    ? { address: "temp", gender: "Other" }
                    : { companyName: "temp", companyAddress: "temp" }
                )
            })
            await tempUser.save()
        }

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for SKILLS SCOUT Registration",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #333;">Job Portal - Email Verification</h2>
                        <p style="font-size: 16px; color: #555;">Your OTP for registration is:</p>
                        <h1 style="color: #8c4caf; font-size: 30px; letter-spacing: 5px;">${otp}</h1>
                        <p style="color: #777;">This OTP will expire in <strong>10 minutes</strong>.</p>
                        <p style="color: #777;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
            `
        })

        res.status(200).json({ "message": "OTP sent successfully to your email" })
    } catch (err) {
        console.log("Error in send-otp:", err)
        res.status(500).json({ "message": "Failed to send OTP. Please try again." })
    }
})

// Verify OTP
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp, role } = req.body

        if (!email || !otp || !role) {
            return res.status(400).json({ "message": "Email, OTP and role are required" })
        }

        const Model = getModel(role)
        if (!Model) {
            return res.status(400).json({ "message": "Invalid role" })
        }

        const user = await Model.findOne({ email })
        if (!user) {
            return res.status(400).json({ "message": "User not found" })
        }

        // Check OTP validity
        if (user.verificationOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ "message": "Invalid or expired OTP" })
        }

        // Mark as verified
        user.isVerified = true
        await user.save()

        res.status(200).json({ "message": "OTP verified successfully" })
    } catch (err) {
        console.log("Error in verify-otp:", err)
        res.status(500).json({ "message": "Verification failed. Please try again." })
    }
})

// Register user
router.post("/register", async (req, res) => {
    try {
        const { email, password, role, name, mobileNumber } = req.body

        // Validate required fields
        if (!email || !password || !role || !name || !mobileNumber) {
            return res.status(400).json({ "message": "All fields are required" })
        }

        const Model = getModel(role)
        if (!Model) {
            return res.status(400).json({ "message": "Invalid role" })
        }

        // Check if user exists and is verified
        const user = await Model.findOne({ email })
        if (!user) {
            return res.status(400).json({ "message": "Please verify your email first" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ "message": "Please verify your email with OTP first" })
        }

        // Validate role-specific fields
        if (role === "jobseeker") {
            const { address, gender } = req.body
            if (!address || !gender) {
                return res.status(400).json({ "message": "Address and gender are required" })
            }
            user.address = address
            user.gender = gender
        } else if (role === "recruiter") {
            const { companyName, companyAddress } = req.body
            if (!companyName || !companyAddress) {
                return res.status(400).json({ "message": "Company name and address are required" })
            }
            user.companyName = companyName
            user.companyAddress = companyAddress
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user with complete information
        user.name = name
        user.password = hashedPassword
        user.mobileNumber = mobileNumber
        user.verificationOtp = undefined
        user.otpExpires = undefined
        await user.save()

        res.status(201).json({ "message": "Registration successful" })
    } catch (err) {
        console.log("Error in register:", err)
        res.status(500).json({ "message": "Registration failed. Please try again." })
    }
})

//tokens
const generalTokens = (user, role) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
    const refreshToken = jwt.sign(
        { id: user._id, role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
    return { accessToken, refreshToken }
}

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ message: "All fields required" });
        let user = null;
        let role = null;

        //jobseeker
        user = await JobSeeker.findOne({ email })
        if (user) role = "jobseeker";

        //recruiter
        if (!user) {
            user = await Recruiter.findOne({ email });
            if (user) role = "recruiter";
        }

        //admin
        if (!user) {
            user = await Admin.findOne({ email });
            if (user) role = "admin";
        }

        if (!user)
            return res.status(401).json({ "message": "invalid email or password" })

        if (!user.isVerified)
            return res.status(403).json({ message: "Please verify your email first" });

        if (user.password === "temp")
            return res.status(400).json({ message: "Please complete registration" });
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(401).json({ "message": "invalid password" })
        //token
        const { accessToken, refreshToken } = generalTokens(user, role)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: "/",
            secure: false,
            sameSite: "lax"
        })
        res.status(200).json({
            "message": "Login successful",
            token: accessToken,
            role,
            user: { id: user._id, name: user.name, email: user.email }
        })
    }

    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
})

//refresh token
router.post("/refresh-token", async (req, res) => {
    const token = req.cookies.refreshToken
    if (!token)
        return res.status(401).json({ "message": "no token apperead" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        let user = null
        console.log("for checking the refresh token", decoded)
        if (decoded.role === "jobseeker") {
            user = await JobSeeker.findById(decoded.id)
        }
        else if (decoded.role === "recruiter") {
            user = await Recruiter.findById(decoded.id)
        }
        else if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id)
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const { accessToken } = generalTokens(user, decoded.role)

        // const newAccessToken = jwt.sign(
        //     { id: user._id, email: user.email,role: decoded.role },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "15m" }
        // )
        res.json({
            accessToken: accessToken,
            user: { id: user._id, email: user.email, name: user.name, role: decoded.role }
        })
    }
    catch (err) {
        console.log("error from refresh token", err)
        return res.status(401).json({ "message": "invalid refresh token" })
    }
})

//logout
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken")
    res.status(200).json({ "message": 'logged out successfully' })
})

//forgot password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body
        if (!email)
            return res.status(400).json({ message: "email required" });
        let user = await JobSeeker.findOne({ email }) ||
            await Recruiter.findOne({ email }) ||
            await Admin.findOne({ email });

        if (!user)
            return res.status(401).json({ message: "Invalid email" });
        const otp = Math.floor(Math.random() * 90000 + 10000).toString()
        user.resetOtp = otp
        user.resetOtpExpire = Date.now() + 10 * 60 * 1000
        await user.save()
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "your OTP for password reset",
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #333;">Job Portal - Email Verification</h2>
                        <p style="font-size: 16px; color: #555;">Your OTP for registration is:</p>
                        <h1 style="color: #8c4caf; font-size: 30px; letter-spacing: 5px;">${otp}</h1>
                        <p style="color: #777;">This OTP will expire in <strong>10 minutes</strong>.</p>
                        <p style="color: #777;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>`
        })
        res.status(200).json({ "message": "sent otp successfully" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post("/verify-reset-otp", async (req, res) => {
    try {
        const { email, otp } = req.body
        // console.log("Received email:", email)
        // console.log("Received OTP:", otp)
        // console.log("OTP type:", typeof otp)
        if (!email || !otp)
            return res.status(400).json({ message: "All fields required" });
        let user = await JobSeeker.findOne({ email }) ||
            await Recruiter.findOne({ email }) ||
            await Admin.findOne({ email })
        if (!user)
            return res.status(404).json({ "message": "User not found" })
        //   console.log("DB OTP:", user.resetOtp);
        //     console.log("Entered OTP:", otp);
        //     console.log("Expire Time:", user.resetOtpExpire);
        //     console.log("Current Time:", Date.now());
        if (user.resetOtp !== otp.toString() || user.resetOtpExpire < Date.now()) {
            return res.status(400).json({ "message": "invalid or expire  otp" })
        }

        res.status(200).json({ "message": "OTP verified successfully" })
    }
    catch (error) {
        res.status(500).json({ message: "Verification failed.Try again" });
    }
})

router.post("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ "message": "all fields required" })
        let user = await JobSeeker.findOne({ email }) ||
            await Recruiter.findOne({ email }) ||
            await Admin.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetOtp = undefined
        user.resetOtpExpire = undefined
        await user.save()
        res.status(200).json({ "message": "password reset succesffuly" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error in reset password" });
    }
})

//refresh page then
router.get("/me", authMiddleware(), (req, res) => {
    res.json({
        user: req.user,
        role: req.user.role
    })
})

// router.put("/jobseekerProfile", async (req, res) => {
//     try {
//         const user = await JobSeeker.findById(req.user._id)
//         if (!user) {
//             return res.status(404).json({ "message": "jobseeker not found" })
//         }
//         const { skills, education, experience } = req.body
//         if (skills) {
//             user.skills = skills;
//         }
//         if (education) {
//             user.education = education
//         }
//         if (experience) {
//             user.experience = experience
//         }
//         if (req.file) {
//             user.resume = `/uploads/resumes/${req.file.filename}`
//         }
//         await user.save()
//         res.json({ "message": "profile updated", user })
//     }
//     catch (error) {
//         res.status(500).json({
//             "message": "Profile edit failed",
//             error: error.message
//         })
//     }
// })
module.exports = router 