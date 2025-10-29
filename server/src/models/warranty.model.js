const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const warrantyClaimSchema = new Schema(
  {
    claimNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "OPEN",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "RESOLVED",
        "CANCELLED",
      ],
      default: "OPEN",
    },
    submittedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    issueDescription: { type: String, required: true, trim: true },
    resolutionNotes: { type: String, trim: true },
    resolutionType: {
      type: String,
      enum: ["REPAIR", "REPLACE", "REFUND", "ADJUSTMENT", "OTHER"],
    },
    documents: [
      {
        url: { type: String, trim: true },
        public_id: { type: String, trim: true },
        label: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Types.ObjectId, ref: "user" },
    updatedBy: { type: Types.ObjectId, ref: "user" },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const warrantyInformationSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "product",
    },
    variant: {
      type: Types.ObjectId,
      ref: "variant",
    },
    user: { type: Types.ObjectId, ref: "user", required: false },
    order: { type: Types.ObjectId, ref: "order" },
    serialNumber: { type: String, trim: true, index: true },
    batchNumber: { type: String, trim: true },
    warrantyCode: { type: String, trim: true, unique: true, required: true },
    activationDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationDays: { type: Number },
    status: {
      type: String,
      enum: ["PENDING_ACTIVATION", "ACTIVE", "EXPIRED", "VOID", "CANCELLED"],
      default: "ACTIVE",
    },
    voidReason: { type: String, trim: true },
    cancellationReason: { type: String, trim: true },
    coverageType: {
      type: String,
      enum: ["STANDARD", "EXTENDED", "PROMOTIONAL", "SERVICE_PLAN", "OTHER"],
      default: "STANDARD",
    },
    claims: [warrantyClaimSchema],
    lastClaimAt: { type: Date },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Types.ObjectId, ref: "user" },
    updatedBy: { type: Types.ObjectId, ref: "user" },
    meta: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre-save: compute durationDays & expire logic
 */
warrantyInformationSchema.pre("save", function (next) {
  try {
    if (this.startDate && this.endDate) {
      const diffDays = Math.round(
        (this.endDate.getTime() - this.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      this.durationDays = diffDays;
    }
    if (this.endDate && this.endDate < new Date() && this.status === "ACTIVE") {
      this.status = "EXPIRED";
      this.isActive = false;
    }
    next();
  } catch (err) {
    next(err);
  }
});
warrantyInformationSchema.pre("findOneAndUpdate", function (next) {
  try {
    const update = this.getUpdate();
    if (update.startDate && update.endDate) {
      const diffDays = Math.round(
        (new Date(update.endDate).getTime() -
          new Date(update.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      update.durationDays = diffDays;
    }
    if (
      update.endDate &&
      update.endDate < new Date() &&
      update.status === "ACTIVE"
    ) {
      update.status = "EXPIRED";
      update.isActive = false;
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Method: addClaim (simplified—no claim count or monetary checks now)
 */
warrantyInformationSchema.methods.addClaim = function ({
  claimNumber,
  issueDescription,
  createdBy,
}) {
  this.claims.push({
    claimNumber,
    issueDescription,
    createdBy,
  });
  this.lastClaimAt = new Date();
};
module.exports = mongoose.model(
  "warrantyInformation",
  warrantyInformationSchema
);
