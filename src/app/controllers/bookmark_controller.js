const mongoose = require("mongoose");
const Bookmark = require("../models/bookmark_model");
const Review = require("../models/review_model");
const jwt = require("jsonwebtoken");

const addBookmark = async (req, res) => {
  const { id, posterPath, title, popularity, releaseDate } = req.body;
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const idUser = decoded.id;

    const newBookmark = new Bookmark({
      userId: idUser,
      id,
      poster_path: posterPath,
      title,
      popularity,
      release_date: releaseDate
    });

    await newBookmark.save();
    res
      .status(201)
      .json({ message: "Bookmark added successfully.", bookmark: newBookmark });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};
const getAllBookmarks = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  let userId = null;

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      userId = decoded.id;
    }

    const allReviews = await Review.find();

    const uniqueReviewIds = [...new Set(allReviews.map(review => review.id))];

    let userBookmarks = [];
    let bookmarkMap = new Map();

    if (userId) {
      userBookmarks = await Bookmark.find({ userId }).select(
        "id isBookmark"
      );
      bookmarkMap = new Map(
        userBookmarks.map(bookmark => [bookmark.id, bookmark])
      );
    }

    const uniqueMovieIds = [
      ...new Set([
        ...uniqueReviewIds,
        ...userBookmarks.map(bookmark => bookmark.id)
      ])
    ];

    const bookmarksWithRatings = await Promise.all(
      uniqueMovieIds.map(async movieId => {
        const movieReviews = allReviews.filter(review => review.id === movieId);

        const overallAverageRating =
          movieReviews.length > 0
            ? (movieReviews.reduce(
                (sum, review) => sum + review.ratingPoint,
                0
              ) / movieReviews.length).toFixed(2)
            : 0;

        let userAverageRating = 0;
        if (userId) {
          const userReviews = movieReviews.filter(review =>
            review.userId.equals(userId)
          );
          userAverageRating =
            userReviews.length > 0
              ? (userReviews.reduce(
                  (sum, review) => sum + review.ratingPoint,
                  0
                ) / userReviews.length).toFixed(2)
              : 0;

        }

        return {
          id: movieId,
          isBookmark:
            userId && bookmarkMap.get(movieId)
              ? bookmarkMap.get(movieId).isBookmark
              : false,
          overallAverageRating,
          userAverageRating
        };
      })
    );

    res.status(200).json({
      message: "All bookmarks and reviews retrieved successfully.",
      bookmarks: bookmarksWithRatings
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};

const getBookmarksByUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const bookmarks = await Bookmark.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "id",
          foreignField: "id",
          as: "allReviews"
        }
      },
      {
        $lookup: {
          from: "reviews",
          let: {
            userId: new mongoose.Types.ObjectId(userId),
            bookmarkId: "$id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$id", "$$bookmarkId"] }
                  ]
                }
              }
            }
          ],
          as: "userReviews"
        }
      },
      {
        $addFields: {
          overallAverageRating: {
            $cond: [
              { $gt: [{ $size: "$allReviews" }, 0] },
              {
                $toString: {
                  $round: [
                    { $toDecimal: { $avg: "$allReviews.ratingPoint" } },
                    2
                  ]
                }
              },
              0
            ]
          },
          userAverageRating: {
            $cond: [
              { $gt: [{ $size: "$userReviews" }, 0] },
              {
                $toString: {
                  $round: [
                    { $toDecimal: { $avg: "$userReviews.ratingPoint" } },
                    2
                  ]
                }
              },
              0
            ]
          },
          formattedReleaseDate: {
            $cond: [
              { $ifNull: ["$release_date", false] },
              { $dateToString: { format: "%Y-%m-%d", date: "$release_date" } },
              null
            ]
          }
        }
      },
      {
        $project: {
          id: 1,
          isBookmark: 1,
          poster_path: 1,
          title: 1,
          popularity: 1,
          overallAverageRating: 1,
          userAverageRating: 1,
          release_date: "$formattedReleaseDate",
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    const totalBookmarks = await Bookmark.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalBookmarks / limit);

    res.status(200).json({
      message: "Bookmarks retrieved successfully.",
      bookmarks,
      pagination: {
        totalBookmarks,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit)
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};

const deleteBookmark = async (req, res) => {
  const { idMovie } = req.params;
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const bookmark = await Bookmark.findOneAndDelete({ id: idMovie, userId });

    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "Bookmark not found for deletion." });
    }

    res.status(200).json({ message: "Bookmark deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: error.message || error });
  }
};

module.exports = {
  addBookmark,
  getAllBookmarks,
  getBookmarksByUser,
  deleteBookmark
};
