const express = require("express");
const {requestCode, register, login, updateUser } = require("../app/controllers/user_controller");
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

module.exports = router;
