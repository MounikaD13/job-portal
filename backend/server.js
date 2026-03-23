const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const jobseekerRoute = require("./routes/jobseekerRoutes")
const recruiterRoute = require("./routes/recruiterRoutes")
const JobRoute = require("./routes/addJobs")
const applicationRoutes = require("./routes/applicationRoutes")
const { initGridFS } = require("./utils/gridFsUpload")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173", // Vite frontend URL
    credentials: true
}))
app.use(cookieParser())

/*mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected successfully")
        initGridFS() //this will called after connection only
    })
    .catch((err) => console.log("MongoDB connection error:", err))

app.use("/api", authRoutes)
app.use("/api/jobseeker",jobseekerRoute)
app.get("/", (req, res) => {
    res.json({ message: "Job Portal API is running" })
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})*/
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected successfully")
        initGridFS()
        app.use("/api", authRoutes)
        app.use("/api/jobseeker", jobseekerRoute)
        app.use("/api/recruiter", recruiterRoute)
        app.use("/api/jobs", JobRoute)
        app.use("/api/applications", applicationRoutes)
        app.get("/", (req, res) => {
            res.json({ message: "Job Portal API is running" })
        })
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err)
    })
// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!" })
})