const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

exports.uploadImage = async (file) => {
    if (!file) throw new Error("File is required");
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "image",
        quality: "auto"
    })
}
