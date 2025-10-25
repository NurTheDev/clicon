const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const invoiceSchema = new Schema({
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    orderId: { type: Types.ObjectId, ref: 'order', required: true },
    userId: { type: Types.ObjectId, ref: 'user', required: true },
    billingAddress: {
        street: { type: String,  trim: true },
        city: { type: String, trim: true },
        state: { type: String,  trim: true },
        postalCode: { type: String,  trim: true },
        country: { type: String,  trim: true }
    },
    shippingAddress: {
        street: { type: String, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true }
    },
    items: [
        {
            productId: { type: Types.ObjectId, ref: 'product', required: true },
            name: { type: String, required: true, trim: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
            total: { type: Number, required: true, min: 0 }
        }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    shippingAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'BDT' },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date },
    status: {
        type: String,
        enum: ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'],
        default: 'UNPAID'
    },
    notes: { type: String, trim: true }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.models.invoice || mongoose.model('invoice', invoiceSchema);
