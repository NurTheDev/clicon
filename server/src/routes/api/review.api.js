const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/review.controller');
const upload = require('../../middleware/multer.middleware');
const multerErrorHandler = require('../../middleware/multerErrorHandler.middleware');
const authGard = require('../../middleware/authGard.middleware');
router.use(multerErrorHandler);

router.route("/create-review").post(authGard, upload.fields([{
    name: 'images',
    maxCount: 10
}]), reviewController.createReview);
router.route("/get-all-reviews").get(reviewController.getAllReviews);
router.route("/get-product-reviews/:productId").get(reviewController.getReviewsByProduct)
router.route("/get-user-reviews/:userId").get(authGard, reviewController.getReviewByUserId)
router.route("/update-review/:reviewId").put(authGard, upload.fields([{
    name: 'images',
    maxCount: 10
}]), reviewController.updateReview)
router.route("/delete-review/:reviewId").delete(authGard, reviewController.deleteReviews)
module.exports = router;