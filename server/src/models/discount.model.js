const mongoose = require("mongoose")
const slugify = require("slugify");
const {Schema, Types} = mongoose

const discountSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    startAt:{
        type: Date,
        required: true
    },
    endAt:{
        type: Date,
        required: true
    },
    isActive: Boolean,
    slug:{
        type: String,
        unique: true,
        trim: true
    },
    discountFor:{
        type: String,
        enum: ["all", "category", "subCategory", "brand", "product"],
        default: "product",
        required: true
    },
    discountType:{
        type: String,
        enum: ["percentage", "fixed"],
    },
    discountValue:{
        type: Number,
        required: true
    },
    category: [{
        type: Types.ObjectId,
        ref: "category"
    }],
    subCategory: [{
        type: Types.ObjectId,
        ref: "subCategory"
    }],
    brand: [{
        type: Types.ObjectId,
        ref: "brand"
    }],
    product: [{
        type: Types.ObjectId,
        ref: "product"
    }]
},{
    timestamps: true,
    versionKey: false
})

discountSchema.pre("save", async function (next) {
    try {
        if(this.isModified("name")){
            this.slug = slugify(this.name,{
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
discountSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate()
        if(update.name){
            update.slug = slugify(update.name,{
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

module.exports = mongoose.models.discount || mongoose.model("discount", discountSchema)