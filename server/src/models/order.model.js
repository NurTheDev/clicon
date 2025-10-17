const mongoose = require("mongoose");
const {MIXED} = require("qrcode/lib/core/mode");
const {Schema, Types} = mongoose;

const orderLineItemSchema = new Schema({
    product: {type: Types.ObjectId, ref: "product", required: true},
    variant: {type: Types.ObjectId, ref: "Variant"},
    quantity: {type: Number, required: true, min: 1},
    unitPrice: {type: Number, required: true, min: 0},
    totalPrice: {type: Number, required: true, min: 0},
    taxAmount: {type: Number, required: true, min: 0},
    discountAmount: {type: Number, required: true, min: 0},
    sku: {type: String, trim: true},
    name: {type: String, trim: true, required: true},
    description: {type: String, trim: true},
    attributes: {
        type: Map, of: String
    }
}, {
    _id: true, timestamps: true
});

const orderSchema = new Schema({
    orderNumber: {type: String, required: true, unique: true, index: true},
    user: {type: Types.ObjectId, ref: "user", required: false, index: true},
    guestId: {type: String, trim: true, index: true},
    status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"],
        default: "PENDING",
        index: true
    },
    orderDate: {type: Date, default: Date.now, index: true},
    totalAmount: {type: Number, required: true, min: 0},
    totalQuantity: {type: Number, required: true, min: 0},
    taxAmount: {type: Number, required: true, min: 0},
    discountAmount: {type: Number, min: 0},
    shippingAmount: {type: Number, required: true, min: 0},
    finalAmount: {type: Number, required: true, min: 0},
    currency: {type: String, trim: true, required: true, default: "BDT"},
    lineItems: [orderLineItemSchema],
    productWeight: {type: Number, min: 0},
    productWeightUnit: {type: String, trim: true, default: "kg"},
    courier: {type: Types.ObjectId, ref: "courier", default: null},
    coupon: {
        type: Types.ObjectId, ref: "coupon",
        default: null
    },
    shippingAddress: {
        fullName: {type: String, trim: true},
        addressLine1: {type: String, trim: true},
        addressLine2: {type: String, trim: true},
        city: {type: String, trim: true},
        state: {type: String, trim: true},
        postalCode: {type: String, trim: true},
        country: {type: String, trim: true},
        phoneNumber: {type: String, trim: true},
        email: {type: String, trim: true}
    },
    billingAddress: {
        fullName: {type: String, trim: true},
        addressLine1: {type: String, trim: true},
        addressLine2: {type: String, trim: true},
        city: {type: String, trim: true},
        state: {type: String, trim: true},
        postalCode: {type: String, trim: true},
        country: {type: String, trim: true},
        phoneNumber: {type: String, trim: true},
        email: {type: String, trim: true}
    },
    deliveryCharge: {type: Types.ObjectId, ref: "deliveryCharge", required: true},
    isBillingAddressSameAsShipping: {type: Boolean, default: true},
    paymentMethod: {type: String, trim: true, required: true, enum: ["COD", "SSL_COMMERZ"]},
    paymentStatus: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
        default: "PENDING",
        index: true
    },
    transactionId: {type: String, trim: true, index: true},
    verificationToken: {type: String, trim: true, index: true, default: null},
    paymentDetails: {type: mongoose.Schema.Types.Mixed, of: String},
    notes: {type: String, trim: true},
    isActive: {type: Boolean, default: true},
    createdBy: {type: Types.ObjectId, ref: "user"},
    updatedBy: {type: Types.ObjectId, ref: "user"},
    meta: {
        type: Map, of: String
    },
    deliveryInfo: {type: Types.ObjectId, ref: "deliveryCharge"},
}, {
    timestamps: true, versionKey: false
});

module.exports = mongoose.models.order || mongoose.model("order", orderSchema);