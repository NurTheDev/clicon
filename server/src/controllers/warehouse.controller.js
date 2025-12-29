const customError = require('../utils/customError');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const warehouseSchema = require('../models/warehouse.model');
const {validateCreateWarehouse, validateUpdateWarehouse} = require('../validators/warehouse.validation');

/**
 * @description Create a new warehouse
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createWarehouse = asyncHandler(async (req, res) => {
    const result = await validateCreateWarehouse(req)
    const warehouse = await warehouseSchema.create(result)
    if (!warehouse) throw new customError("Warehouse creation failed", 400)
    success(res, "Warehouse created successfully", warehouse, 201)
})
/**
 * @description Get all warehouses
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await warehouseSchema.find()
    if (!warehouses) throw new customError("Warehouses not found", 400)
    success(res, "Warehouses fetched successfully", warehouses, 200)
})

/**
 * @description Update a warehouse by warehouseId
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateWarehouse = asyncHandler(async (req, res) => {
    const {warehouseId} = req.params
    const result = await validateUpdateWarehouse(req)
    const warehouse = await warehouseSchema.findByIdAndUpdate(warehouseId, result, {new: true})
    if (!warehouse) throw new customError("Warehouse not found", 400)
    success(res, "Warehouse updated successfully", warehouse, 200)
})

/**
 * @description Delete a warehouse by warehouseId
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteWarehouse = asyncHandler(async (req, res) => {
    const {warehouseId} = req.params
    const warehouse = await warehouseSchema.findByIdAndDelete(warehouseId)
    if (!warehouse) throw new customError("Warehouse not found", 400)
    success(res, "Warehouse deleted successfully", warehouse, 200)
})

/**
 * @description Get a warehouse by warehouseId
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getWarehouseById = asyncHandler(async (req, res) => {
    const {warehouseId} = req.params
    const warehouse = await warehouseSchema.findById(warehouseId)
    if (!warehouse) throw new customError("Warehouse not found", 400)
    success(res, "Warehouse fetched successfully", warehouse, 200)
})