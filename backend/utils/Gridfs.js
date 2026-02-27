// const mongoose = require("mongoose")
// const { GridFSBucket } = require("mongodb")
// const multer = require("multer")
// const { GridFsStorage } = require("multer-gridfs-storage")

// let gfsBucket;
// //called once after mongoose is connected call in the server
// const initGridFS = () => {
//     const db = mongoose.connection.db
//     gfsBucket = new GridFSBucket(db, {
//         bucketName: "uploads"
//     })
//     console.log("Gridfs bucket initialized")
// }
// const getGfsBucket = () => {
//     if (!gfsBucket) {
//         throw new Error("GridFSBucket not initialized")
//     }
//     return gfsBucket
// }

// //multer storage using gridfs 
// const createStorage = (folder) =>
//     new GridFsStorage({
//         // url: process.env.MONGODB_URL,
//         // options: { useNewUrlParser: true },
//         db: mongoose.connection, //reuse existing connection
//         file: (req, file) => {
//             return {
//                 bucketName: "uploads",
//                 filename: `${folder}_${req.user.id}_${Date.now()}_${file.originalname}`,
//                 metadata: {
//                     userId: req.user.id,
//                     folder,
//                     mimetype: file.mimetype,
//                 },
//             }
//         },
//     })

// //files and image
// const imageFilter = (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png"]
//     if (!allowed.includes(file.mimetype)) {
//         return cb(new Error("Only JPG and PNG images are allowed"), false)
//     }
//     cb(null, true)
// }

// const pdfFilter = (req, file, cb) => {
//     if (file.mimetype !== "application/pdf") {
//         return cb(new Error("Only PDF files are allowed"), false)
//     }
//     cb(null, true)
// }

// //multer instance
// const uploadProfilePic = multer({
//     storage: createStorage("profilePic"),
//     fileFilter: imageFilter,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// })

// const uploadResume = multer({
//     storage: createStorage("resume"),
//     fileFilter: pdfFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// })
// module.exports = { initGridFS, getGfsBucket, uploadProfilePic, uploadResume }
const mongoose = require("mongoose")
const { GridFSBucket } = require("mongodb")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")

let gfsBucket
let uploadProfilePic
let uploadResume

const initGridFS = () => {
    const db = mongoose.connection.db
    gfsBucket = new GridFSBucket(db, { bucketName: "uploads" })

    uploadProfilePic = multer({
        storage: createStorage("profilePic"),
        fileFilter: imageFilter,
        limits: { fileSize: 2 * 1024 * 1024 },
    })

    uploadResume = multer({
        storage: createStorage("resume"),
        fileFilter: pdfFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })

    console.log("GridFS bucket initialized")
}

const getGfsBucket = () => {
    if (!gfsBucket) throw new Error("GridFSBucket not initialized")
    return gfsBucket
}

const createStorage = (folder) =>
    new GridFsStorage({
        db: mongoose.connection,  // reuse existing connection
        file: (req, file) => ({
            bucketName: "uploads",
            filename: `${folder}_${req.user.id}_${Date.now()}_${file.originalname}`,
            metadata: {
                userId: req.user.id,
                folder,
                mimetype: file.mimetype,
            },
        }),
    })

const imageFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"]  // removed image/jpg
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only JPG and PNG images are allowed"), false)
    }
    cb(null, true)
}

const pdfFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"), false)
    }
    cb(null, true)
}

module.exports = {
    initGridFS,
    getGfsBucket,
    get uploadProfilePic() { return uploadProfilePic },
    get uploadResume() { return uploadResume },
}