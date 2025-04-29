import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// Signup Route (User Only)
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if user already exists by phone or email
    let userExists = await User.findOne({ $or: [{ phone }, { email }] });
    if (userExists) {
      if (userExists.phone === phone) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      phone, 
      email, 
      password: hashedPassword, 
      role: "user" 
    });
    
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Return user object without password
    const userToReturn = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: userToReturn 
    });
  } catch (err) {
    console.error("Error in /signup:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login Route (User or Admin)
router.post("/signin", async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if ((!phone && !email) || !password) {
      return res.status(400).json({ message: "Phone or email and password are required" });
    }

    const query = phone ? { phone } : { email };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Return user object without password
    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        emergencyContact: user.emergencyContact,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error in /signin:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Since we're using token-based authentication, the client should remove the token
  res.json({ message: "Logged out successfully" });
});

export default router;