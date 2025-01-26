const express = require("express");
const {
  addBookmark,
  getAllBookmarks,
  getBookmarksByUser,
  deleteBookmark
} = require("../app/controllers/bookmark_controller");
const authenticateToken = require("../middlewares/authentication_token");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: API for managing bookmarks
 */

/**
 * @swagger
 * /bookmarks/add:
 *   post:
 *     summary: Add a bookmark
 *     tags: [Bookmarks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "movie_123"
 *               posterPath:
 *                 type: string
 *                 example: "https://example.com/poster.jpg"
 *               title:
 *                 type: string
 *                 example: "Movie Title"
 *               popularity:
 *                 type: number
 *                 example: 9.5
 *               releaseDate:
 *                 type: string
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookmark added successfully."
 *                 bookmark:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "userId123"
 *                     id:
 *                       type: string
 *                       example: "movie_123"
 *                     posterPath:
 *                       type: string
 *                       example: "https://example.com/poster.jpg"
 *                     title:
 *                       type: string
 *                       example: "Movie Title"
 *                     popularity:
 *                       type: number
 *                       example: 9.5
 *                     releaseDate:
 *                       type: string
 *                       example: "2024-12-01"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/bookmarks/add", authenticateToken, addBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get all bookmarks for a user
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: All bookmarks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All bookmarks retrieved successfully."
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "movie_123"
 *                       isBookmark:
 *                         type: boolean
 *                         example: true
 *                       userAverageRating:
 *                         type: string
 *                         example: "4.25"
 *                       overallAverageRating:
 *                         type: string
 *                         example: "4.15"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/bookmarks", getAllBookmarks);

/**
 * @swagger
 * /bookmarks/list:
 *   get:
 *     summary: Get a paginated list of bookmarks by user ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of bookmarks per page (default is 10)
 *     responses:
 *       200:
 *         description: List of bookmarks retrieved successfully with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "movie_123"
 *                       posterPath:
 *                         type: string
 *                         example: "https://example.com/poster.jpg"
 *                       title:
 *                         type: string
 *                         example: "Movie Title"
 *                       popularity:
 *                         type: number
 *                         example: 9.5
 *                       ratingPoint:
 *                         type: number
 *                         example: 8.5
 *                       isBookmark:
 *                         type: boolean
 *                         example: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalBookmarks:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: No bookmarks found
 *       500:
 *         description: Server error
 */
router.get("/bookmarks/list", authenticateToken, getBookmarksByUser);

/**
 * @swagger
 * /bookmarks/{idMovie}/delete:
 *   delete:
 *     summary: Delete a bookmark by movie ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to delete
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Server error
 */
router.delete("/bookmarks/:idMovie/delete", authenticateToken, deleteBookmark);

module.exports = router;
