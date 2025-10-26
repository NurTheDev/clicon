const { Role } = require("../models/RBAC.model");
const customError = require("../utils/customError");
const NodeCache = require("node-cache");
const permissionSchema = require("../models/RBAC.model");
const userSchema = require("../models/user.model");
const permissionCache = new NodeCache({ stdTTL: 3600 });
// Middleware to check user permissions
const checkAuthorization = (resource, action, checkOwnership = null) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      // Check if permissions are cached
      let userPermissions = permissionCache.get(userId);
      if (!userPermissions) {
        // Fetch user permissions from DB
        const user = await userSchema
          .findById(userId)
          .populate("role permissions")
          .lean();
        if (!user) {
          return next(new customError("Unauthorized", 401));
        }
        userPermissions = user.permissions || [];
        // Cache the permissions
        permissionCache.set(userId, userPermissions);
      }
      // Check if user has the required permission
      const hasPermission = userPermissions.some(
        (permission) =>
          permission.resource === resource && permission.action === action
      );
      if (!hasPermission) throw new customError("Access denied", 403);
      // if ownership check is required
      if (checkOwnership) {
        if (
          !req.user.role ||
          req.user.role !== "admin" ||
          req.user.role !== "moderator"
        ) {
          const resourceOwnerId = await checkOwnership(req);
          if (resourceOwnerId.toString() !== userId) {
            throw new customError("Access denied - not the owner", 403);
          }
        }
      }
      // If ownership check passes, proceed
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      throw new customError("Access denied", 403);
    }
  };
};

module.exports = checkAuthorization;
