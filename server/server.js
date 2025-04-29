import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; 
import disasterReportRoutes from "./routes/disasterReport.js";
import emailAlertRoutes from "./routes/emailAlert.js";
import alertRoutes from "./routes/alert.js";
import volunteerRoutes from "./routes/volunteer.js";
import adminRoutes from "./routes/admin.js";  
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Setup Routes
app.use('/api/email', emailAlertRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use("/api/user", userRoutes);

// Session and Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to `true` when using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/disaster", disasterReportRoutes);

//  Admin Routes
app.use("/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Disaster Management API Running...");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" MongoDB Connected");
    await createDefaultAdmin(); 
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Create default admin if none exists
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log(' Default Admin Created');
    } else {
      console.log(' Admin already exists');
    }
  } catch (error) {
    console.error(' Error creating default admin:', error.message);
  }
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));