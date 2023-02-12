const { campgroundSchema } = require("./schemas");
const { ExpressError } = require("./utils/ExpressError");
const { campground } = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
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

module.exports.isAuthor = async (req, res, next) => {
  const groundId = req.params.id;
  const campground = await Campground.findById(groundId);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permissions to do that!");
    res.redirect(`/campgrounds/${groundId}`);
  }
  next();
};
