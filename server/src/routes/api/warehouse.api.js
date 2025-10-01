const express = require('express');
const router = express.Router();
const warehouseController = require('../../controllers/warehouse.controller');
const authGard = require('../../middleware/authGard.middleware');

router.route("/create-warehouse").post(authGard, warehouseController.createWarehouse);
router.route("/get-all-warehouses").get(warehouseController.getAllWarehouses);
router.route("/update-warehouse/:warehouseId").put(authGard, warehouseController.updateWarehouse);
router.route("/delete-warehouse/:warehouseId").delete(authGard, warehouseController.deleteWarehouse);
router.route("/getWarehouseByID/:warehouseId").get(warehouseController.getWarehouseById)

module.exports = router;