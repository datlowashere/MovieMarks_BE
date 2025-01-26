const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    poster_path: {
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
    release_date:{
      type: Date,
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

module.exports = mongoose.model("bookmarks", bookmarkSchema);
