const express = require("express");
const {
  createReview,
  getReviewsById
} = require("../app/controllers/review_controller");
const authenticateToken = require("../middlewares/authentication_token");

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64a1234567abcdef12345678"
 *               id:
 *                 type: string
 *                 example: "product123"
 *               content:
 *                 type: string
 *                 example: "Great, good movie!"
 *               ratingPoint:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review created successfully
 *       500:
 *         description: Server error
 */
router.post("/reviews", authenticateToken, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get all reviews for a specific ID with user details
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: string
 *           example: "product123"
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       404:
 *         description: No reviews found for this ID
 *       500:
 *         description: Server error
 */
router.get("/reviews/:id", getReviewsById);

module.exports = router;
