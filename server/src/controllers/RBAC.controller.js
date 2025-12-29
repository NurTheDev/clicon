const customError = require("../utils/customError");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const { Permission, Role } = require("../models/RBAC.model");
const { userValidation } = require("../validators/user.validator");
const userSchema = require("../models/user.model");
const userModel = require("../models/user.model");
const { uploadImage, deleteImage } = require("../helpers/claudinary");
const NodeCache = require("node-cache");
const permissionCache = new NodeCache({ stdTTL: 3600 });
exports.createUser = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const result = await userValidation(req);
  if (!result) throw new customError("User validation failed", 401);
  if (req.file && req.file.path) {
    //     check image mime type
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      throw new customError("Image must be a jpeg, jpg, png or webp", 400);
    }
  }
  // now upload image to cloudinary
  if (req.file && req.file.path) {
    const uploadResult = await uploadImage(req.file.path, "users");
    if (uploadResult && uploadResult.public_id && uploadResult.secure_url) {
      result.image = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }
  }
  const user = await userModel.create(result);
  if (!user) {
    // if image was uploaded, delete it from cloudinary
    if (result.image && result.image.public_id) {
      await deleteImage(result.image.public_id);
    }
    throw new customError("User creation failed", 500);
  }
  return success(res, "User created successfully", user, 201);
});
/**
 * Get all users which has a role assigned except common users
 * types {(function(*, *, *): Promise<void>)|*}
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  // const role = {role: {$ne: 'user'}}
  const users = await userModel
    .find({ role: { $exists: true, $ne: null } })
    .select("-password")
    .populate({ path: "role", select: "name description isActive" });
  if (!users) throw new customError("User validation failed", 401);
  return success(res, "Users fetched successfully", users, 200);
});
// give permission to a user
exports.setPermissionToUser = asyncHandler(async (req, res) => {
  const { userId, permissionId } = req.body;
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
});
// get permissions of a user
exports.getUserPermissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("userId", req.params);
  const user = await userModel.findById(userId).populate("permissions");
  if (!user) {
    throw new customError("User not found", 404);
  }
  return success(
    res,
    "User permissions fetched successfully",
    user.permissions,
    200
  );
});
// remove permission from a user
exports.removePermissionFromUser = asyncHandler(async (req, res) => {
  const { userId, permissionId } = req.body;
  const user = await userModel.findById(userId);
  if (!user) {
    throw new customError("User not found", 404);
  }
  const permission = await Permission.findById(permissionId);
  if (!permission) {
    throw new customError("Permission not found", 404);
  }
  user.permissions = user.permissions.filter(
    (permId) => permId.toString() !== permission._id.toString()
  );
  await user.save();
  return success(res, "Permission removed successfully", user, 200);
});
// create role
exports.createRole = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const role = await Role.create({ name, description, isActive });
  if (!role) {
    throw new customError("Role creation failed", 500);
  }
  return success(res, "Role created successfully", role, 201);
});
// get all roles
exports.getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  return success(res, "Roles fetched successfully", roles, 200);
});
// update role
exports.updateRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { name, description, isActive } = req.body;
  const role = await Role.findByIdAndUpdate(
    roleId,
    { name, description, isActive },
    { new: true }
  );
  if (!role) {
    throw new customError("Role not found", 404);
  }
  return success(res, "Role updated successfully", role, 200);
});
// delete role
exports.deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const role = await Role.findByIdAndDelete(roleId);
  if (!role) {
    throw new customError("Role not found", 404);
  }
  return success(res, "Role deleted successfully", role, 200);
});
// create permission
exports.createPermission = asyncHandler(async (req, res) => {
  const { resource, action, description, conditions, scope } = req.body;
  const permission = await Permission.create({
    resource,
    action,
    description,
    conditions,
    scope,
  });
  if (!permission) {
    throw new customError("Permission creation failed", 500);
  }
  return success(res, "Permission created successfully", permission, 201);
});
// get all permissions
exports.getAllPermissions = asyncHandler(async (req, res) => {
  const cachedPermissions = permissionCache.get("permissions");
  if (cachedPermissions) {
    return success(
      res,
      "Permissions fetched successfully",
      cachedPermissions,
      200
    );
  }
  const permissions = await Permission.find();
  permissionCache.set("permissions", permissions);
  return success(res, "Permissions fetched successfully", permissions, 200);
});
