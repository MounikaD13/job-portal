const mongoose = require("mongoose")
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
    required: true
  },
  salary: {
    min: Number,
    max: Number
  },
  experienceRequired: {
    type: Number,
    required: true
  },
  skillsRequired: [String],
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true
  },
  applicantsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Job", jobSchema)
/*recruiterId → recruiterId
This helps to:
show recruiter jobs , show recruiter dashboard ,restrict editing only to job owner */