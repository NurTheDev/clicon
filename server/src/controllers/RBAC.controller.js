const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");
const {Permission, Role} = require("../models/RBAC.model");
const {userValidation} = require("../validators/user.validator");
const userSchema = require("../models/user.model");
const userModel = require("../models/user.model");
const {uploadImage, deleteImage} = require('../helpers/claudinary');

exports.createUser = asyncHandler(async (req, res) => {
    console.log("req.body", req.body)
    const result = await userValidation(req)
    if (!result) throw new customError("User validation failed", 401)
        if (req.file && req.file.path) {
            //     check image mime type
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            if (!validMimeTypes.includes(req.file.mimetype)) {
                throw new customError("Image must be a jpeg, jpg, png or webp", 400)
            }
        }
// now upload image to cloudinary
        if (req.file && req.file.path) {
            const uploadResult = await uploadImage(req.file.path, 'users');
            if (uploadResult && uploadResult.public_id && uploadResult.secure_url) {
                result.image = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                }
            }
        }
    const user = await userModel.create(result)
    if (!user) {
        // if image was uploaded, delete it from cloudinary
        if (result.image && result.image.public_id) {
            await deleteImage(result.image.public_id);
        }
        throw new customError("User creation failed", 500)
    }
    return success(res, "User created successfully", user, 201)
})
/**
 * Get all users which has a role assigned except common users
 * @type {(function(*, *, *): Promise<void>)|*}
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    // const role = {role: {$ne: 'user'}}
    const users = await userModel.find({role: {$exists: true, $ne: null}}).select('-password').populate({path: 'role', select: 'name description isActive'});
    if (!users) throw new customError("User validation failed", 401)
    return success(res, "Users fetched successfully", users, 200)
})
// give permission to a role
exports.setPermissionToUser = asyncHandler(async (req, res) => {
     const {userId, permissionId} = req.body;
     const user = await userModel.findById(userId);
     if (!user) {
         throw new customError("User not found", 404);
     }
     const permission = await Permission.findById(permissionId);
     if (!permission) {
         throw new customError("Permission not found", 404);
     }
        user.permissions.push(permission._id);
        await user.save();
        return success(res, "Permission updated successfully", user, 200);
})
// get permissions of a role
// remove permission from a role
// create role
// get all roles
// update role
// delete role
