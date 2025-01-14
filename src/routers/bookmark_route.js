const express = require("express");
const { addBookmark, getBookmarksByUser, deleteBookmark } = require("../app/controllers/bookmark_controller");
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
 * /bookmarks/{idUser}/add:
 *   post:
 *     summary: Add a bookmark
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               posterPath:
 *                 type: string
 *                 example: "https://example.com/poster.jpg"
 *               title:
 *                 type: string
 *                 example: "Movie Title"
 *               popularity:
 *                 type: number
 *                 example: 9.5
 *               ratingPoint:
 *                 type: number
 *                 example: 8.5
 *               isRating:
 *                 type: boolean
 *                 example: true
 *               isBookmark:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/bookmarks/:idUser/add", authenticateToken, addBookmark);


/**
 * @swagger
 * /bookmarks/{idUser}/list:
 *   get:
 *     summary: Get a paginated list of bookmarks by user ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
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
 *                       id_bookmark:
 *                         type: string
 *                         example: "645a2d3bcd987fa3c1234567"
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
 *                       isRating:
 *                         type: boolean
 *                         example: true
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
router.get("/bookmarks/:idUser/list", authenticateToken, getBookmarksByUser);

/**
 * @swagger
 * /bookmarks/{idBookmark}/delete:
 *   delete:
 *     summary: Delete a bookmark by ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: idBookmark
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bookmark to delete
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Server error
 */
router.delete("/bookmarks/:idBookmark/delete", authenticateToken, deleteBookmark);

module.exports = router;
