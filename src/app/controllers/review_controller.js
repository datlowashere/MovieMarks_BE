const Review = require("../models/review_model");

const createReview = async (req, res) => {
  const { userId, id, content, ratingPoint } = req.body;

  try {
    const newReview = new Review({
      userId,
      id,
      content,
      ratingPoint
    });

    await newReview.save();

    res.status(201).json({
      message: "Review created successfully.",
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

const getReviewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ id })
      .populate("userId", "fullName avatar")
      .exec();

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this ID." });
    }

    res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = { createReview, getReviewsById };
