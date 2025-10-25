class apiResponse{
    constructor(message, data, statusCode){
        this.message = message || "success message";
        this.data = data;
        this.statusCode = statusCode
        this.status = statusCode >= 200 && statusCode <=300 ? "success" : "error"
    }
    static success(res,message, data, statusCode){
        return res.status(statusCode).json(new apiResponse(message, data, statusCode))
    }
}
module.exports = apiResponse
