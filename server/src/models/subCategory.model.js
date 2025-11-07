const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema, Types } = mongoose;
const subCategorySchema = new Schema(
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
    discount: {
      type: Types.ObjectId,
      ref: "discount",
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "product",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// slugify the subCategory name
subCategorySchema.pre("save", async function (next) {
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
    console.error(error);
    next(error);
  }
});
subCategorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (update.name) {
      update.slug = slugify(update.name, {
        lower: true,
        remove: /[*+~.()"'!:@]/g,
        strict: true,
      });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports =
  mongoose.models.subCategory ||
  mongoose.model("subCategory", subCategorySchema);
