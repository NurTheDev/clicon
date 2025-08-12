const Joi = require('joi');
const customError = require("../utils/customError");

const categoryValidation = Joi.object({
    name: Joi.string().trim().empty().messages({
        "string.empty": "Name is required",
        "string.trim": "Name filled with extra spaces",
    })
}).options({
    abortEarly: true,
    allowUnknown: true  // allow unknown fields like image, isActive, slug
})

exports.categoryValidation = async (req)=>{
    try{
        const result = await categoryValidation.validateAsync(req.body)
        const validMimeTypes =[
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ]
    //     Check image type
        if(!validMimeTypes.includes(req.files.image[0].mimetype)){
            throw new customError("Image must be a jpeg, jpg, png or webp", 400)
        }

    }catch (error){
        if(error.details){
            console.log("error from category validator", error.details[0].message)
            throw new customError(error.details[0].message, 400)
        }else{
            console.log("error from category validator", error)
            throw new customError(error, 400)
        }
    }
}