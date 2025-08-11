const customError = require("../utils/customError")
const {verify} = require("jsonwebtoken")
const userSchema = require("../models/user.model")

const authGard = async(req, _, next)=>{
    try{
        const token = req.headers.authorization || req.body.token
    }catch(error){
        next(error)
    }
}
