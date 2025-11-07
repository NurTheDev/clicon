const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");

require("dotenv").config();
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    image: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subCategories: [{ type: Types.ObjectId, ref: "subCategory" }],
    products: [{ type: Types.ObjectId, ref: "product" }],
    discount: [{ type: Types.ObjectId, ref: "discount" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// slugify the category name
categorySchema.pre("save", async function (next) {
  try {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre("find", function (next) {
  this.sort({ createdAt: -1 });
  next();
});

module.exports =
  mongoose.models.category || mongoose.model("category", categorySchema);
