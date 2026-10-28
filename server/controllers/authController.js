const sendEmail = require("../utils/sendEmail");
const bcrypts = require("bcryptjs")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" })
    }

    const hashedPassword = await bcrypts.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },

    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fileds are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });

    }
    const isMatch = await bcrypts.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },

    });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const message = "If this email is registered, a reset link has been sent";

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    console.log("Password reset link:", resetUrl);

    sendEmail({
      to: user.email,
      subject: "Password reset request",
      text: `Click the link below to reset your password. It is valid for 15 minutes.\n\n${resetUrl}`,
    }).catch((emailError) => {
      console.log("Email failed:", emailError.message);
    });

    res.status(200).json({ message });

   
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypts.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
module.exports = { signup, login, getMe, forgotPassword, resetPassword };