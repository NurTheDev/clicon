const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    const validMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ]
    if(!validMimeTypes.includes(file.mimetype)){
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
    }
    cb(null, true)
}

const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024 * 15}, fileFilter}) // 15MB
module.exports = upload