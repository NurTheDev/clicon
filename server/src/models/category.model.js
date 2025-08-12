const mongoose = require("mongoose");
const {Schema, Types} = mongoose;
const customError = require("../utils/customError");
const slugify = require("slugify");

require("dotenv").config();
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: String,
    isActive: Boolean,
    subCategories: [
        {type: Types.ObjectId, ref: "subCategory"}
    ],
    discount: [
        {type: Types.ObjectId, ref: "discount"}
    ]
}, {
    timestamps: true,
    versionKey: false
})
// slugify the category name
categorySchema.pre("save", async function (next) {
    try {
        if (this.isModified("name")) {
            this.slug = slugify(this.name, {
                lower: true,
                remove: /[*+~.()'"!:@]/g,
                strict: true
            })
        }
        // Check if the slug is unique
        const category = await this.constructor.findOne({slug: this.slug});
        if (category && category._id.toString() !== this._id.toString()) throw new customError("Category already" +
            " exists", 400)
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model("category", categorySchema)