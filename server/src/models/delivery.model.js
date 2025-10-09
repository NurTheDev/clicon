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

const deliverySchema = new Schema({
    order: {type: Types.ObjectId, ref: "order", required: true},
    courier: {type: Types.ObjectId, ref: "courier"},
    trackingNumber: {type: String, trim: true, required: true, unique: true},
    status: {
        type: String,
        enum: ["PENDING", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED_ATTEMPT", "RETURNED", "CANCELLED"],
        default: "PENDING",
        index: true
    },
    shippedAt: {type: Date}, //When package was picked up
    deliveredAt: {type: Date}, //When delivery was completed
    estimatedDelivery: {type: Date}, //Expected delivery date
    deliveryAttempts: {type: Number, default: 0}, //Number of delivery attempts
    lastAttemptAt: {type: Date},  //Last delivery attempt time
    recipientSignature: {type: String, trim: true}, //Counter for how many times delivery was attempted
    notes: {type: String, trim: true},
    isActive: {type: Boolean, default: true},
    createdBy: {type: Types.ObjectId, ref: "user"},
    updatedBy: {type: Types.ObjectId, ref: "user"},
    meta: {
        type: Map, of: String
    },
    followUps: [{
        followUpAt: {type: Date, default: Date.now},
        notes: {type: String, trim: true},
        createdBy: {type: Types.ObjectId, ref: "user"}
    }]
}, {
    _id: true, timestamps: true
});

deliverySchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'DELIVERED' && !this.deliveredAt) {
        this.deliveredAt = new Date();
    }
    next();
})
deliveryChargeSchema.pre('save', async function () {
    const exists = await this.constructor.findOne({
        name: this.name,
        _id: { $ne: this._id } // allow same doc on update
    });
    if (exists) {
        throw new customError('Delivery charge with this name already exists', 400);
    }
});
module.exports = {
    Delivery: mongoose.models.delivery || mongoose.model("delivery", deliverySchema),
    DeliveryCharge: mongoose.models.deliveryCharge || mongoose.model("deliveryCharge", deliveryChargeSchema)
};