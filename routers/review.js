const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  const { error } = result;
  if (error) {
    const msg = error.details
      .map((el) => {
        return el.message;
      })
      .join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    ground.reviews.push(review);
    await review.save();
    await ground.save();
    req.flash("success", "Created new review!!");
    res.redirect(`/campgrounds/${ground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
