const jwt= require("jsonwebtoken")
const Jobseeker = require("../models/JobSeeker")
const Recruiter = require("../models/Recruiter")
const Admin = require("../models/Admin") 

const authMiddleware=(roles = []) => {
    return async (req,res,next)=>{
    try{
        const authHeader = req.headers["authorization"]
        if (!authHeader) {
            return res.status(401).json({ "meassage": "token not provided" })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user

      // ✅ choose model based on role
      if (decoded.role === "jobseeker") {
        user = await Jobseeker.findById(decoded.id).select("-password")
      }
      else if (decoded.role === "recruiter") {
        user = await Recruiter.findById(decoded.id).select("-password")
      }
      else if (decoded.role === "admin") {
        user = await Admin.findById(decoded.id).select("-password")
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

        if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
        req.user = user //{id,email,role}
        next()
    }
    catch(err){
       return res.status(401).json({ "messsage": "invalid or token expired" }) 
    }
}}
module.exports = authMiddleware