const mongoose = require("mongoose");
const {Schema, Types} = mongoose;
const slugify = require("slugify");

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {type: String, trim: true},
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiscountAmount: {
        type: Number,
        min: 0
    },
    minPurchaseAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    usageLimitPerUser: {
        type: Number,
        min: 1,
        default: 1
    },
    usageLimitTotal: {
        type: Number,
        min: 1
    },
    totalUsed: {
        type: Number,
        default: 0
    },
    usersUsed: [
        {type: Types.ObjectId, ref: "user"}
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    applicableProducts: [
        {type: Types.ObjectId, ref: "product"}
    ],
    applicableCategories: [
        {type: Types.ObjectId, ref: "category"}
    ],
    applicableSubCategories: [
        {type: Types.ObjectId, ref: "subCategory"}
    ],
    applicableBrands: [
        {type: Types.ObjectId, ref: "brand"}
    ],
    slug: {
        type: String,
        unique: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
})

// slugify the coupon code
couponSchema.pre("save", async function (next) {
    try {
        if (this.isModified("code")) {
            this.slug = slugify(this.code, {
                lower: true,
                remove: /[*+~.()'"!:@]/g,
                strict: true
            })
        }
        next()
    } catch (error) {
        next(error)
    }
})
couponSchema.pre("find", function (next) {
    this.sort({createdAt: -1})
    next()
})
couponSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.code) {
        update.slug = slugify(update.code, {
            lower: true,
            remove: /[*+~.()'"!:@]/g,
            strict: true
        })
    }
    next()
})

module.exports = mongoose.models.coupon || mongoose.model("coupon", couponSchema)