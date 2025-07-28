const productionError = (error, res)=> {
    const statusCode = error.statusCode || 500;
    if(error.isOperational){
        res.status(statusCode).json({
            message: error.message,
            status: error.status,
        })
    } else{
        res.status(500).json({
            message: "Something went wrong",
            status: "error",
        })
    }
}

module.exports = productionError
