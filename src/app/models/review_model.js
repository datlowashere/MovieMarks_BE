const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
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
    content: {
      type: String,
      required: true
    },
    ratingPoint: {
      type: Number,
      default: 0
    },
    releaseDate:{
      type: Date,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("reviews", reviewSchema);
