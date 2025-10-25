const productionError = (error, res)=> {
    console.log("production error")
    const statusCode = error.statusCode || 500;
    if(error.isOperational){
        res.status(statusCode).json({
            statusCode: statusCode,
            message: error.message,
            status: error.status,
        })
    } else{
        res.status(500).json({
            statusCode: statusCode,
            message: "Something went wrong",
            status: "error",
        })
    }
}

module.exports = productionError
