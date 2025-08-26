const mongoose = require("mongoose")
const {Types} = require("mongoose");
const {Schema} = mongoose

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    image: {
        type: Object,
        required: true,
    },
    isActive: Boolean,
    discount: {
        type: Types.ObjectId,
        ref: "discount"
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.models.brand || mongoose.model("brand", brandSchema)