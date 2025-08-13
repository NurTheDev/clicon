const multer = require('multer');
const customError = require("../utils/customError");

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let message = "";
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size is too large. Maximum size is 15MB";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "File must be a jpeg, jpg, png or webp";
        } else {
            message = err.message;
        }
        return next(new customError(message, 400));
    } else if (err) {
        return next(new customError(err.message, 400));
    }
    next(err);
};

module.exports = multerErrorHandler;