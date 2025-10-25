const mongoose = require('mongoose');
const {Schema, Types} = mongoose;

const warehouseSchema = new Schema({
    name: {type: String, required: true, unique: true, trim: true},
    location: {type: String, required: true, trim: true},
    isActive: {type: Boolean, default: true},
    products: [{type: Types.ObjectId, ref: 'product'}],
    address: {
        type: Object,
        required: true,
    },
    contact: {
        type: Object,
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
    },
    alertStock: {
        type: Number,
        default: 5
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
warehouseSchema.pre('save', function (next) {
    try {
        if (this.isModified('name') || this.isNew) {
            this.slug = this.name.toLowerCase().replace(/ /g, '-');
        }
        next();
    } catch (error) {
        console.error(error);
    }
})
warehouseSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        let name = update.name
        if (!name) {
            const doc = await this.model.findOne(this.getQuery());
            name = name || doc.name
        }
        if (name) {
            update.slug = name.toLowerCase().replace(/ /g, '-');
        }
        next();
    } catch (error) {
        console.error(error);
    }
})
module.exports = mongoose.models.warehouse || mongoose.model('warehouse', warehouseSchema);