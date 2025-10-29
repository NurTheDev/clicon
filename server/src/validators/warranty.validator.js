const Joi = require("joi");
const customError = require("../utils/customError");

const warrantyClaimSchema = Joi.object({
  issueDescription: Joi.string().trim().required().messages({
    "any.required": "Issue description is required",
    "string.empty": "Issue description cannot be empty",
    "string.trim": "Issue description filled with extra spaces",
  }),
  resolutionType: Joi.string()
    .valid("REPAIR", "REPLACE", "REFUND", "ADJUSTMENT", "OTHER")
    .messages({
      "any.only":
        "Resolution type must be one of REPAIR, REPLACE, REFUND, ADJUSTMENT, OTHER",
    }),
  resolutionNotes: Joi.string().trim().messages({
    "string.trim": "Resolution notes filled with extra spaces",
  }),
});

exports.warrantyClaimValidation = async (req) => {
  try {
    const result = warrantyClaimSchema.validate(req.body);
    if (result.error) {
      throw customError(result.error.details[0].message, 400);
    }
    return true;
  } catch (error) {
    throw error;
  }
};
