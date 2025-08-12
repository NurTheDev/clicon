const customError = require("../utils/customError")
const {verify} = require("jsonwebtoken")
const userSchema = require("../models/user.model")
const authGard = async (req, _, next) => {
    const token = req.headers.authorization || req.body.token
    if (!token) {
        throw new customError("Unauthorized", 401)
    }
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
    if (!decoded) {
        throw new customError("Unauthorized", 401)
    }
    const user = await userSchema.findById(decoded.id)
    if (!user) {
        throw new customError("Unauthorized", 401)
    }
    let userObj = {}
    userObj.id = user._id
    userObj.email = user.email
    req.user = userObj
    next()
}

module.exports = authGard
