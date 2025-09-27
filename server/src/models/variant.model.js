const mongoose = require('mongoose');
const {Schema, Types} = mongoose;

const variantSchema = new Schema({
    product: {type: Types.ObjectId, ref: 'product', required: true},
    sku: {type: String, unique: true},
    price: {type: Number, required: true},
    salePrice: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: 'Sale price ({VALUE}) should be less than the regular price.'
        }
    },
    stock: {type: Number, default: 0},
    size: {
        type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], default: 'M', capitalize: true
    },
    color: {
        type: String,
        enum: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Gray', 'Pink'],
        default: 'Black'
    },
    images: [{
        url: {type: String, required: true}, public_id: {type: String, required: true}
    }],
    isActive: {type: Boolean, default: true},
    slug: {type: String, unique: true, lowercase: true, trim: true},
    alertStock: {type: Number, default: 5}
}, {timestamps: true});

variantSchema.pre('save', function (next) {
    try {
        if (this.isModified('sku') || this.isNew) {
            this.sku = `${this.product.toString().slice(-4).toUpperCase()}-${this.size}-${this.color}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (this.isModified('color') || this.isNew) {
            this.slug = `${this.product.toString().slice(-4).toLowerCase()}-${this.size.toLowerCase()}-${this.color.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        next();
    } catch (error) {
        console.error(error);
    }
})
variantSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        let product = update.product
        let size = update.size
        let color = update.color
        if (!product || !size || !color) {
            const doc = await this.model.findOne(this.getQuery());
            product = product || doc.product
            size = size || doc.size
            color = color || doc.color

        }
        if (color || size) {
            update.slug = `${product.toString().slice(-4).toLowerCase()}-${size.toLowerCase()}-${color.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
            update.sku = `${product.toString().slice(-4).toUpperCase()}-${size.toUpperCase()}-${color.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
        }
        next();
    } catch (error) {
        console.error(error);
    }
})

module.exports = mongoose.models.Variant || mongoose.model('Variant', variantSchema);