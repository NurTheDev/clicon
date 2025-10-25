const {Role} = require('../models/RBAC.model');
const customError = require('../utils/customError');
const NodeCache = require("node-cache");
const permissionCache = new NodeCache({stdTTL: 3600});
// Middleware to check user permissions
const checkPermission = (resource, action, checkOwnership = null) => {
    return async (req, res, next) => {
        try {
            const cacheKey = `role:${req.user.role}:permissions`;
            let role = permissionCache.get(cacheKey);
            if(!role){
                role = await Role.findById(req.user.role).populate('permissions').lean();
                permissionCache.set(cacheKey, role);
                if(!role || !role.isActive){
                    throw new customError('Role not found', 404);
                }
            }
            const hasPermission = role.permissions.some(permission =>
                permission.resource === resource && permission.action === action
            );
            if (!hasPermission) {
                throw new customError('Access denied: insufficient permissions', 403);
            }
            const permission = role.permission.find(perm => perm.resource === resource && perm.action === action);
            if(permission.scope === 'own' && checkOwnership){
                const isOwner = await checkOwnership(req.user, req.params);
                if(!isOwner){
                    throw new customError('Access denied: insufficient ownership', 403);
                }
            }
            next();
        } catch (error) {
            console.log("error in permission middleware", error);
            throw new customError('Permission Check faild', 500);
        }
    }
}

module.exports = checkPermission;