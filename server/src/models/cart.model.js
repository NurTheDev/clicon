const mongoose = require("mongoose")
const {Schema, Types} = mongoose;
const customError = require("../utils/customError")

const cartItemSchema = new Schema({
    product: {type: Types.ObjectId, ref: "product", required: true},
    variant: {type: Types.ObjectId, ref: "Variant"},
    color: {type: String, trim: true},
    size: {type: String, trim: true},
    quantity: {type: Number, required: true, min: 1, default: 1},
    price: {type: Number, required: true, min: 0},
    total: {type: Number, required: true, min: 0},
    discount: {type: Number, min: 0},
    finalPrice: {type: Number, min: 0}
}, {_id: false})

const cartSchema = new Schema({
    userId: {type: Types.ObjectId, ref: "user",unique: true},
    guestId: {type: String, trim: true},
    items: {type: [cartItemSchema], default: []},
    totalQuantity: {type: Number, required: true, min: 0, default: 0},
    totalPrice: {type: Number, required: true, min: 0, default: 0},
    isActive: {type: Boolean, default: true},
    notes: {type: String, trim: true},
    createdBy: {type: Types.ObjectId, ref: "user"},
    updatedBy: {type: Types.ObjectId, ref: "user"}
}, {
    timestamps: true, versionKey: false
})

// Check that either userId or guestId is provided
cartSchema.pre("validate", async function (next) {
    if (!this.userId && !this.guestId) {
        return next(new customError("Either userId or guestId must be provided", 400));
    }
    if (this.userId && this.guestId) {
        return next(new customError("Only one of userId or guestId should be provided", 400));
    }
    next();
})

module.exports = mongoose.models.cart || mongoose.model("cart", cartSchema)