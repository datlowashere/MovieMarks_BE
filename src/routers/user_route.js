const express = require("express");
const {requestCode, register, login, logout, updateUser, getUserInfo } = require("../app/controllers/user_controller");
const authenticateToken = require("../middlewares/authentication_token");
const upload = require("../middlewares/upload");

const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API for user authentication and profile management
 */

/**
 * @swagger
 * /sendcode:
 *   post:
 *     summary: Send verification code to user's email
 *     tags:
 *       - Authentication
 *     description: Send a one-time verification code (OTP) to the user's email for verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post("/sendcode", requestCode);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     description: Registers a new user by verifying the provided OTP (sent to the user's email) and creating an account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid or expired verification code
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     description: Log in a user by email and password to get an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post("/login", login);


/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Authentication
 *     description: Logs out the user by invalidating their access token. Requires an access token in the Authorization header.
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/logout", authenticateToken, logout);

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update user information
 *     tags:
 *       - Authentication
 *     description: Update user's full name, username, and avatar. Requires access token.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/update", authenticateToken, upload.single("avatar"), updateUser);

/**
 * @swagger
 * /getuserinfo:
 *   get:
 *     summary: Get user information
 *     tags:
 *       - Authentication
 *     description: Retrieve the user's information using their access token.
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User information retrieved successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64b25a4e3fd75a001c2e38b5
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     avatar:
 *                       type: string
 *                       example: https://cloudinary.com/image.jpg
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/getuserinfo", authenticateToken, getUserInfo);

module.exports = router;
