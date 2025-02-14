const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.flash("error", err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload","/upload/h_300,w_250")
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { listing , originalImage});
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid Data");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined")  {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successfully.");
  res.redirect(`/listings`);
};

module.exports.searchListing = async (req, res) => {
  let { search } = req.query; 

  if (!search) {
    return res.status(400).send("Search parameter is required");
  }

  try {
    const listings = await Listing.find({ title: { $regex: search, $options: 'i' } });

    if (listings.length === 0) {
      return res.status(404).send("No listings found matching your search");
    }

    res.render("listing/search.ejs" ,{listings});
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};