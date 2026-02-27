const jwt= require("jsonwebtoken")
const authMiddleware=(roles = []) => {
    return (req,res,next)=>{
    try{
        const authHeader = req.headers["authorization"]
        if (!authHeader) {
            return res.status(401).json({ "meassage": "token not provided" })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
        req.user = decoded //{id,email,role}
        next()
    }
    catch(err){
       return res.status(401).json({ "messsage": "invalid or token expired" }) 
    }
}}
module.exports = authMiddleware