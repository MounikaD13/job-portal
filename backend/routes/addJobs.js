const express = require("express")
const router = express.Router()
const Recruiter = require("../models/Recruiter")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const {
    getBucket,
    uploadToGridFS
} = require("../utils/gridFsUpload")

module.exports=router