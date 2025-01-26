const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("../../config/cloundinary");

require("dotenv").config();
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const requestCode = async (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    otpStore[email] = {
      code: verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification code sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email.", error: error.message || error  });
  }
};
const register = async (req, res) => {
  const { email, password, code } = req.body;

  try {
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res
        .status(400)
        .json({
          message:
            "No verification code found for this email. Please request a new code."
        });
    }

    if (storedOTP.code !== code) {
      return res.status(400).json({ message: "Incorrect verification code." });
    }

    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[email];
      return res
        .status(400)
        .json({
          message: "Verification code has expired. Please request a new code."
        });
    }

    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();

    delete otpStore[email];

    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message || error  });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email does not exist." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      // { expiresIn: "1h" }
    );

    user.accessToken = accessToken;
    await user.save();

    res.json({ message: "Login successful.", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message || error  });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.accessToken = null;
    await user.save();

    res.json({ message: "Logout successful." });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Server error.", error: error.message || error  });
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
    res.status(500).json({ message: "Server error.", error: error.message || error  });
  }
};

const getUserInfo = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password -accessToken");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User information retrieved successfully.", user });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Server error.", error: error.message || error  });
  }
};


module.exports = { requestCode, register, login, logout, updateUser,getUserInfo };
