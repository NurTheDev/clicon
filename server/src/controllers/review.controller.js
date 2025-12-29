const Review = require('../models/review.model');
const asyncHandler = require('../helpers/asyncHandler');
const {success} = require('../utils/apiResponse');
const customError = require('../utils/customError');
const {uploadImage, deleteImage} = require('../helpers/claudinary');
const {createReviewValidate, updateReviewValidate} = require('../validators/review.validator');
const ProductSchema = require('../models/product.model');
const UserSchema = require('../models/user.model');
/**
 * @description Create a new review
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.createReview = asyncHandler(async (req, res) => {
    const result = await createReviewValidate(req)
    const imagePromises = result.images.map(img => uploadImage(img.path))
    const imageResponses = await Promise.all(imagePromises)
    const images = imageResponses.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
    }))
    const review = await Review.create({
        ...result,
        images
    })
    const product = await ProductSchema.findById(result.product)
    const user = await UserSchema.findById(result.user)
    await product.updateOne({
        $push: {reviews: review._id}
    })
    await user.updateOne({
        $push: {reviews: review._id}
    })
    if (!review) throw new customError("Review creation failed", 400)
    success(res, "Review created successfully", review, 201)
})

/**
 * @description Get all reviews
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
    if (!reviews) throw new customError("Reviews not found", 400)
    success(res, "Reviews fetched successfully", reviews, 200)
})

/**
 * get all reviews by product
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getReviewsByProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params
    const reviews = await Review.find({product: productId})
    if (!reviews) throw new customError("Reviews not found", 400)
    success(res, "Reviews fetched successfully", reviews, 200)
})

/**
 * @description Get a review by userID
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.getReviewByUserId = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const reviews = await Review.find({user: userId})
    console.log(reviews)
    if (!reviews) throw new customError("Reviews not found", 400)
    success(res, "Reviews fetched successfully", reviews, 200)
})
/**
 * @description Update a review by reviewId
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.updateReview = asyncHandler(async (req, res) => {
    console.log(req)
    const {reviewId} = req.params
    const result = await updateReviewValidate(req)
    const review = await Review.findById(reviewId)
    if (!review) throw new customError("Review not found", 400)
    console.log(result)
    const imagePromises = result.images.map(img => uploadImage(img.path))
    const imageResponses = await Promise.all(imagePromises)
    const images = imageResponses.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
    }))
    const updatedReview = await Review.findByIdAndUpdate(reviewId, {
        ...result,
        images: {$push: images}
    })
    if (!updatedReview) {
        const deletePromises = images.map(img => deleteImage(img.public_id))
        await Promise.all(deletePromises)
        throw new customError("Review update failed", 400)
    }
    success(res, "Review updated successfully", updatedReview, 200)
})
exports.deleteReviewImages = asyncHandler(async (req, res) => {
    const {reviewID} = req.params
    const {public_id} = req.body
    const review = await Review.findById(reviewID)
    if (!review) throw new customError("Review not found", 404)
    const updatedImages = review.images.filter(img => img.public_id !== public_id)
    const updatedReview = await Review.findByIdAndUpdate(reviewID, {
        images: updatedImages
    }, {new: true, runValidators: true})
    if (!updatedReview) throw new customError("Failed to delete image from review", 400)
    await deleteImage(public_id)
    success(res, "Image deleted successfully", updatedReview, 200)
})
/**
 * @description Delete a review by reviewId
 * types {(function(*, *, *): Promise<void>)|*}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
exports.deleteReviews = asyncHandler(async (req, res) => {
    const {reviewId} = req.params
    const review = await Review.findByIdAndDelete(reviewId)
    if (!review) throw new customError("Review not found", 400)
    success(res, "Review deleted successfully", review, 200)
})