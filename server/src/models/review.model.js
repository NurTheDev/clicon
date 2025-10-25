const mongoose = require('mongoose');
const {Schema, Types} = mongoose;

const reviewSchema = new Schema({
    product: {type: Types.ObjectId, ref: 'product', required: true},
    user: {type: Types.ObjectId, ref: 'user', required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true, versionKey: false});

module.exports = mongoose.models.review|| mongoose.model('review', reviewSchema);