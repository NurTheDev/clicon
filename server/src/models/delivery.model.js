const mongoose = require('mongoose');
const {Schema, Types} = mongoose;
const customError = require("../utils/customError")
const deliveryChargeSchema = new Schema({
    name: {type: String, trim: true, required: true},
    amount: {type: Number, required: true, min: 0},
    currency: {type: String, trim: true, required: true, default: "BDT"},
    description: {type: String, trim: true},
    isActive: {type: Boolean, default: true},
    createdBy: {type: Types.ObjectId, ref: "user"},
    updatedBy: {type: Types.ObjectId, ref: "user"}
}, {
    _id: true, timestamps: true
});

deliveryChargeSchema.pre('save', async function () {
    const exists = await this.constructor.findOne({
        name: this.name,
        _id: {$ne: this._id} // allow same doc on update
    });
    if (exists) {
        throw new customError('Delivery charge with this name already exists', 400);
    }
});
module.exports = mongoose.models.deliveryCharge || mongoose.model("deliveryCharge", deliveryChargeSchema);