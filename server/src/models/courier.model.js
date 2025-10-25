const mongoose = require('mongoose');
const {Schema, Types} = mongoose;
const customError = require("../utils/customError")

const courierSchema = new Schema({
    recipient_name: {type: String, trim: true, required: true},
    recipient_address: {type: String, trim: true, required: true},
    recipient_phone: {type: String, trim: true, required: true},
    recipient_email: {type: String, trim: true},
    codAmount: {type: Number, required: true, min: 0}, //Cash on Delivery amount
    order: {type: Types.ObjectId, ref: "order", required: true},
    trackingNumber: {type: String, trim: true, required: true, unique: true},
    status: {
        type: String,
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
    invoice: {type: String, trim: true}, //URL or path to invoice document
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

courierSchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'DELIVERED' && !this.deliveredAt) {
        this.deliveredAt = new Date();
    }
    next();
})
module.exports = mongoose.models.courier || mongoose.model("courier", courierSchema);