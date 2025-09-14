const exp = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const AdminAccount = require("../models/adminAccountModel");
const authMiddleware = require("../Middleware/adminAuthMiddleware");

const adminApp = exp.Router();

// -----------------------------
// Admin Login
// -----------------------------
adminApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const admin = await AdminAccount.findOne({ username });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {adminId: admin.adminId, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 Set token in cookie instead of sending it in response body
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1h in ms
    });
    console.log("Cookie set for client:", {
      name: "adminToken",
      value: token,
    });
    res.status(200).send({ message: "Login successful" });
  })
);

// -----------------------------
// Change Password (Protected)
// -----------------------------
adminApp.post(
  "/change-password",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

const admin = await AdminAccount.findOne({ adminId: req.admin.adminId });
 if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Old password is incorrect" });
    }

    admin.password = newPassword; // will be hashed by pre-save hook
    await admin.save();

    res.status(200).send({ message: "Password updated successfully" });
  })
);

adminApp.post("/logout", (req, res) => {
  // Check if the cookie exists
  console.log("Logout request cookies:");
  if (!req.cookies?.adminToken) {
    console.log("No adminToken cookie found");
    return res.status(400).send({ message: "No admin cookie to clear" });
  }
  else{
    console.log("adminToken cookie found:", req.cookies.adminToken);
  }

  // Clear the cookie
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  console.log("logged out, cookie cleared");
  res.status(200).send({ message: "Logged out successfully" });
});

module.exports = adminApp;
