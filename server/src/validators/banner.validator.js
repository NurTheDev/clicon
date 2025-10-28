const Joi = require("joi");
const customError = require("../utils/customError");

const bannerValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title is required",
    "string.trim": "Title filled with extra spaces",
  }),
  description: Joi.string().trim().messages({
    "string.trim": "Description filled with extra spaces",
  }),
  link: Joi.string().uri().trim().messages({
    "string.uri": "Link must be a valid URL",
    "string.trim": "Link filled with extra spaces",
  }),
  slug: Joi.string().trim().messages({
    "string.trim": "Slug filled with extra spaces",
  }),
  priority: Joi.number().integer().min(0).messages({
    "number.base": "Priority must be a number",
    "number.integer": "Priority must be an integer",
    "number.min": "Priority must be at least 0",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive must be a boolean",
  }),
  startDate: Joi.date().messages({
    "date.base": "Start Date must be a valid date",
  }),
  endDate: Joi.date().messages({
    "date.base": "End Date must be a valid date",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});
const bannerUpdateValidationSchema = bannerValidationSchema.fork(
  [
    "title",
    "description",
    "link",
    "slug",
    "priority",
    "isActive",
    "startDate",
    "endDate",
  ],
  (schema) => schema.optional()
);

exports.bannerValidation = async (req) => {
  try {
    const result = bannerValidationSchema.validate(req.body);
    return result.value;
  } catch (error) {
    console.error(error);
    if (error.details) {
      console.log("error from banner validator", error.details[0].message);
      throw new customError(error.details[0].message, 400);
    } else {
      console.log("error from banner validator", error);
      throw new customError(error, 400);
    }
  }
};

exports.updateBannerValidation = async (req) => {
  try {
    const result = bannerUpdateValidationSchema.validate(req.body);
    return result.value;
  } catch (error) {
    console.error(error);
    if (error.details) {
      console.log(
        "error from banner update validator",
        error.details[0].message
      );
      throw new customError(error.details[0].message, 400);
    } else {
      console.log("error from banner update validator", error);
      throw new customError(error, 400);
    }
  }
};

module.exports = {
  bannerValidation,
  updateBannerValidation,
};
