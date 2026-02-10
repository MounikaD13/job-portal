const jwt= require("jsonwebtoken")
const authMiddleware=(roles = []) => {
    return (req,res,next)=>{
    try{
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(401).json({ "meassage": "token not provided" })
        }
        const finalToken = token.split(" ")[1]
        const decoded = jwt.verify(finalToken, process.env.JWT_SECRET)
        if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
        req.user = decoded
        next()
    }
    catch(err){
       return res.status(401).json({ "messsage": "invalid or token expired" }) 
    }
}}
module.exports = authMiddleware