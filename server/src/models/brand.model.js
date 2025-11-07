const mongoose = require("mongoose");
const { Types } = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;

const brandSchema = new Schema(
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
    discount: {
      type: Types.ObjectId,
      ref: "discount",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create slug before save
brandSchema.pre("save", async function (next) {
  try {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, {
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
brandSchema.pre("findOneAndUpdate", async function (next) {
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

module.exports = mongoose.models.brand || mongoose.model("brand", brandSchema);
