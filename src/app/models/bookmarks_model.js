const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookmarksSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    id: {
      type: String,
      required: true
    },
    posterPath: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    popularity: {
      type: Number,
      default: 0
    },
    ratingPoint: {
      type: Number,
      default: 0
    },
    isRating: {
      type: Boolean,
      default: false
    },
    isBookmark: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("bookmarks", bookmarksSchema);
