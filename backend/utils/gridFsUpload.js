const mongoose = require("mongoose")
const { GridFSBucket } = require("mongodb")

let bucket

const initGridFS = () => {
    bucket = new GridFSBucket(
        mongoose.connection.db,
        { bucketName: "uploads" }
    )

    console.log("✅ GridFS Ready")
}

const getBucket = () => {
    if (!bucket)
        throw new Error("GridFS not initialized")
    return bucket
}

// ✅ MAIN FUNCTION
const uploadToGridFS = (file, folder, userId) => {
    return new Promise((resolve, reject) => {

        if (!file) return resolve(null)

        const bucket = getBucket()

        const uploadStream =
            bucket.openUploadStream(
                `${folder}_${userId}_${Date.now()}_${file.originalname}`,
                {
                    contentType: file.mimetype,
                    metadata: {
                        userId,
                        folder
                    }
                }
            )

        uploadStream.end(file.buffer)

        uploadStream.on("finish",
            () => resolve(uploadStream.id)
        )

        uploadStream.on("error", reject)
    })
}

module.exports = {
    initGridFS,
    getBucket,
    uploadToGridFS
}