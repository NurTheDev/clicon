const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");
const {Permission, Role} = require("../models/RBAC.model");
const {userValidation} = require("../validators/user.validator");
const userSchema = require("../models/user.model");
const userModel = require("../models/user.model");
exports.createUser = asyncHandler(async (req, res) => {
    const result = await userValidation(req)
    if (!result) throw new customError("User validation failed", 401)
    const user = await userModel.create(result)
    if (!user) throw new customError("User validation failed", 401)
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