const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../config/cloundinary");

require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const username = email.split("@")[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    user.accessToken = accessToken;
    await user.save();

    res.json({ message: "Login successful.", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

const updateUser = async (req, res) => {
  const { fullName, username } = req.body;
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "moviemarks",
        use_filename: true,
        unique_filename: false
      });

      user.avatar = uploadResult.secure_url;
    }

    await user.save();
    res.json({ message: "User information updated successfully.", user });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = { register, login, updateUser };
