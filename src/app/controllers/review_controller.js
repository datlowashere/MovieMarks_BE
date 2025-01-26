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

    const populatedReview = await Review.findById(newReview._id).populate(
      "userId",
      "_id email fullName username avatar"
    );

    res.status(201).json({
      message: "Review created successfully.",
      review: populatedReview
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};

const getReviewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ id })
      .populate("userId", "fullName avatar username email")
      .sort({ createdAt: -1 })
      .exec();

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this ID.",
        reviews: [],
        averageRating: 0
      });
    }
    const averageRating =
      reviews.reduce((total, review) => total + review.ratingPoint, 0) /
      reviews.length;

    res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews,
      averageRating: averageRating.toFixed(2)
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};

module.exports = { createReview, getReviewsById };
