require("dotenv").config();
const developmentError = require("../helpers/developmentError");
const productionError = require("../helpers/productionError");
const globalError = (error, res)=>{
    if(process.env.NODE_ENV === "development"){
        developmentError(error, res)
    } else {
        productionError(error, res)
    }
}

module.exports = globalError
