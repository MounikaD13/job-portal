const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = upload
/*his file does ONLY ONE thing-It reads multipart/form-data from frontend.
Without it:
req.file === undefined
Node.js cannot understand file uploads by default.So this file is your file parser. */