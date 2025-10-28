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

const Banner = mongoose.models.Banner ||  mongoose.model("Banner", bannerSchema);

module.exports = Banner;
