const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware");
const validateCampground = require("");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const ground = new Campground(req.body.campground);
    ground.author = req.user._id;
    await ground.save();
    req.flash("success", "You have uploaded a campground successfully!!");
    return res.redirect(`/campgrounds/${ground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(ground);
    if (!ground) {
      req.flash("error", "Cannot find the campground");
      return res.redirect("/campgrounds");
    }
    console.log(ground);
    res.render("campgrounds/show", { ground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const groundId = req.params.id;
    const ground = await Campground.findById(groundId);
    if (!ground) {
      req.flash("error", "Cannot find the campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { ground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const groundId = req.params.id;
    const ground = await Campground.findByIdAndUpdate(groundId, {
      ...req.body.campground,
    });
    req.flash("success", "You have successfully updated the campground!!");
    res.redirect(`/campgrounds/${ground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const groundId = req.params.id;
    await Campground.findByIdAndDelete(groundId);
    req.flash("success", "Successfully deleted the campground!!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
