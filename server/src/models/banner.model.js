const mongoose = require("mongoose");
const { Types, Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    link: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

bannerSchema.pre("save", function (next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    return next(
      new Error("Start date must be earlier than or equal to end date")
    );
  }
  next();
});

bannerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.startDate && update.endDate && update.startDate > update.endDate) {
    return next(
      new Error("Start date must be earlier than or equal to end date")
    );
  }
  next();
});

bannerSchema.pre("save", async function (next) {
  try {
    if (this.isModified("title")) {
      this.slug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    next();
  } catch (error) {
    next(error);
  }
});
bannerSchema.pre("findOneAndUpdate", function (next) {
  try {
    const update = this.getUpdate();
    if (update.title) {
      update.slug = update.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

module.exports = Banner;
