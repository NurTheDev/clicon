const asyncHandler =(fn)=>{
    return async (req, res, next)=>{
        try{
           await fn(req, res)
        }catch(error){
            next(error)
        }
    }
}
module.exports = asyncHandler
