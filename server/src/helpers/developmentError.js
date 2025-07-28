const developmentError = (error, res) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message,
        stack: error.stack,
        status: error.status,
        isOperational: error.isOperational,
        data: error.data
    })
}

module.exports = developmentError
