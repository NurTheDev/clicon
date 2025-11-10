const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const userSchema = require("../models/user.model");
const { Permission, Role } = require("../models/RBAC.model");
const crypto = require("crypto");
require("dotenv").config();
/**
 * Extract a JWT from the request.
 * Priority:
 * 1) Authorization: Bearer <token>
 * 2) Cookie: access_token
 * 3) Body: token (optional; avoid in production if possible)
 */
function extractToken(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  if (req.body?.token) {
    return req.body.token;
  }
  return null;
}
/**
 * Extract secret from request headers
 */
function extractSecret(req) {
  const secret = req.headers["x-secret"] || req.headers["X-Secret"];
  if (typeof secret === "string") {
    return secret.trim();
  }
  return null;
}
/**
 * Verify request secret
 */
const verifySecret = (req, secret) => {
  const Secret = extractSecret(req);
  if (!Secret) return false;
  return Secret === secret;
};
/**
 * Express auth guard middleware.
 * - Verifies JWT
 * - Loads user from DB
 * - Attaches req.user = { id, email, role }
 */
async function authGuard(req, res, next) {
  try {
    //Verify request Secret
    if (process.env.ENABLE_SECRET_VERIFICATION === "true") {
      const isValidSecret = verifySecret(req, process.env.API_SECRET);
      if (!isValidSecret) {
        return next(new customError("Invalid secret", 401));
      }
    } else {
      console.log("ℹ️  Secret verification disabled");
    }
    const token = extractToken(req);
    if (!token) {
      return next(new customError("Unauthorized", 401));
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, {});
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new customError("Token expired", 401));
      }
      return next(new customError("Unauthorized", 401));
    }
    // Extract user id from token (support common claim names)
    const userId = decoded.sub || decoded.id || decoded.userId;
    if (!userId) {
      return next(new customError("Unauthorized", 401));
    }

    // Fetch only what you need
    const user = await userSchema
      .findById(userId)
      .select("_id email role status tokenVersion permissions")
      .populate("role permissions")
      .lean();

    if (!user) {
      return next(new customError("Unauthorized", 401));
    }

    if (user.status && user.status !== "active") {
      return next(new customError("User account is not active", 403));
    }
    req.user = {
      id: user._id.toString(),
      email: user.email && user.email,
      phone: user.phone && user.phone,
      status: user.status,
      role: user.role,
      permissions: user.permissions,
    };

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = authGuard;
