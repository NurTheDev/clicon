const mongoose = require("mongoose")
const slugify = require("slugify");
const {Schema, Types} = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    discount: [{
        type: Types.ObjectId,
        ref: "discount"
    }],
    subCategory: {
        type: Types.ObjectId,
        ref: "subCategory"
    },
    brand: {
        type: Types.ObjectId,
        ref: "brand"
    },
    category: {
        type: Types.ObjectId,
        ref: "category"
    },
    reviews: [
        {
            type: Types.ObjectId,
            ref: "review"
        }
    ],
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    wholeSalePrice: {
        type: Number
    },
    retailPrice: {
        type: Number
    },
    wholeSaleProfit: Number,
    retailProfit: Number,
    discountPrice: Number,
    tags: [
        {
            type: String,
            trim: true
        }
    ],
    sku: {
        type: String,
    },
    warranty: {
        type: String,
        trim: true
    },
    shipping: {
        type: String,
        trim: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    returnPolicy: {
        type: String,
        trim: true
    },
    minimumOrderQuantity: {
        type: Number,
        required: true
    },
    thumbnail: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    variantType: {
        type: String,
        enum: ["single", "multiple"],
        default: "single"
    },
    variant: [
        {
            type: Types.ObjectId,
            ref: "variant"
        }
    ],
    size: {
        type: String,
        enum: ["xs", "s", "m", "l", "xl", "xxl"],
        default: "m"
    },
    color: {
        type: String,
        enum: ["red", "blue", "green", "yellow", "black", "white", "gray", "brown", "purple", "orange", "custom"],
        default: "black"
    },
    customColor: {
        type: String,
        trim: true
    },
    groupUnit: {
        type: String,
        enum: ["box", "pack", "set", "pair", "unit", "other"],
        default: "unit"
    },
    groupQuantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        enum: ["piece", "kg", "gram", "litre", "ml", "other"],
        default: "piece"
    },
    barCode: {
        url: String,
        public_id: String
    },
    QRCode: {
        url: String,
        public_id: String
    },
    alertQuantity: {
        type: Number,
        required: true,
        min: 5
    },
    wearHouse: [
        {
            type: Types.ObjectId,
            ref: "wearHouse"
        }
    ],
    totalSales: {
        type: Number,
        default: 0
    },
    isBestSelling:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

productSchema.pre("save", function (next) {
    try {
        if (this.isModified("name")) {
            this.slug = slugify(this.name, {
                lower: true,
                remove: /[*+~.()"'!:@]/g,
                strict: true
            })
        }
        next()
    } catch (error) {
        console.error(error);
        next(error)
    }
})
productSchema.pre("findOneAndUpdate", function (next) {
    try {
        const update = this.getUpdate()
        if (update.name) {
            update.slug = slugify(update.name, {
                lower: true,
                remove: /[*+~.()"'!:@]/g,
                strict: true
            })
        }
        next()
    } catch (error) {
        console.error(error);
        next(error)
    }
})

module.exports = mongoose.models.product || mongoose.model("product", productSchema)
