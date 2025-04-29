import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile route
router.put("/update", authMiddleware, async (req, res) => {
  const { id } = req.user;  // From auth middleware
  const { name, phone, email, address, emergencyContact } = req.body;

  // Build update object with only provided fields
  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (email) updateFields.email = email;
  if (address !== undefined) updateFields.address = address;
  if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact;

  try {
    // Check if email is being changed and ensure it's unique
    if (email) {
      const existingUserWithEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Check if phone is being changed and ensure it's unique
    if (phone) {
      const existingUserWithPhone = await User.findOne({ phone, _id: { $ne: id } });
      if (existingUserWithPhone) {
        return res.status(400).json({ message: "Phone number is already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
});

export default router;