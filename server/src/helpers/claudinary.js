const cloudinary = require('cloudinary').v2;
const customError = require("../utils/customError");
require('dotenv').config();
const fs = require('fs');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (file) => {
    try {
        if (!file) throw new Error("File is required");
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "image",
            quality: "auto"
        })
        if (result) {
            fs.unlinkSync(file)
            return result
        }
    } catch (error) {
        if (fs.existsSync(file) && file) {
            fs.unlinkSync(file)
        }
        throw new customError(error.message, 400)
    }
}

