class customError extends Error{
    constructor(message, statusCode){
        super(message);
        this.message = message || "Something went wrong";
        this.statusCode = statusCode;
        this.data = null
        this.status = statusCode >= 400 ? "client error" : "server error"
        this.isOperational = true
        Error.captureStackTrace(this, customError);
    }
}

module.exports = customError
