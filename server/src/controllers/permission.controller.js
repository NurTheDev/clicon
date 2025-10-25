const customError = require("../utils/customError")
const {success} = require('../utils/apiResponse');
const asyncHandler = require("../helpers/asyncHandler");
const {Permission} = require("../models/RBAC.model");

// Controller to get all permissions
exports.getAllPermissions = asyncHandler(async (req, res) => {
    const permissions = await Permission.find({});
    res.status(200).json(success(permissions, "Permissions fetched successfully"));
});

// Controller to create a new permission
exports.createPermission = asyncHandler(async (req, res) => {
    const {resource, action, description, conditions, scope} = req.body;
    const existingPermission = await Permission.findOne({resource, action});
    if (existingPermission) {
        throw new customError("Permission already exists", 400);
    }
    const newPermission = new Permission({
        resource,
        action,
        description,
        conditions,
        scope
    });
    await newPermission.save();
    res.status(201).json(success(newPermission, "Permission created successfully"));
});

// Controller to update an existing permission
exports.updatePermission = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {resource, action, description, conditions, scope} = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(
        id,
        {resource, action, description, conditions, scope},
        {new: true}
    );
    if (!updatedPermission) {
        throw new customError("Permission not found", 404);
    }
    res.status(200).json(success(updatedPermission, "Permission updated successfully"));
});

// Controller to delete a permission
exports.deletePermission = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const deletedPermission = await Permission.findByIdAndDelete(id);
    if (!deletedPermission) {
        throw new customError("Permission not found", 404);
    }
    res.status(200).json(success(deletedPermission, "Permission deleted successfully"));
});