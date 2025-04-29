import express from "express";
import multer from "multer";
import DisasterReport from "../models/DisasterReport.js";
import User from "../models/User.js";
import sendEmail from "../util/sendEmail.js";
import sendSMS from "../util/sendSMS.js";
import reverseGeocode from "../util/reverseGeocode.js";
import axios from "axios";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Google reCAPTCHA verification function
const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );
    console.log("Token received from frontend:", token);
    console.log("reCAPTCHA API Response:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
};

// Route to report a disaster
router.post("/report", upload.array("media", 5), async (req, res) => {
  try {
    const {
      disasterName,
      location,
      description,
      recaptchaToken,
      severity,
      contact,
    } = req.body;
    const files = req.files;
    console.log("Received reCAPTCHA token:", recaptchaToken);

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }

    const parsedLocation = JSON.parse(location);
    let readableLocation = "Unknown location";

    // Determine readable location
    if (parsedLocation.lat && parsedLocation.lng) {
      readableLocation = await reverseGeocode(parsedLocation.lat, parsedLocation.lng);
    } else if (parsedLocation.name || parsedLocation.address) {
      readableLocation = parsedLocation.name || parsedLocation.address;
    }

    // Convert uploaded files to base64 media URLs
    const mediaUrls = files.map((file) =>
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );

    // Save report to database
    const report = new DisasterReport({
      disasterName,
      location: parsedLocation,
      media: mediaUrls,
      description,
      severity,
      contact,
    });

    await report.save();

    // Send email alerts to all users
    try {
      const users = await User.find({}, "email");
      const emailPromises = users.map((user) =>
        sendEmail(user.email, disasterName, readableLocation, description)
      );
      await Promise.all(emailPromises);
      console.log("Alert emails sent to all users.");
    } catch (emailError) {
      console.error("Error sending email alerts:", emailError);
    }

    // Send SMS alerts to all users
    try {
      const usersWithPhone = await User.find({ phone: { $exists: true, $ne: "" } }, "phone");
      const smsMessage = `🚨 ${disasterName} reported in ${readableLocation}. Stay safe.`;
      const smsPromises = usersWithPhone.map((user) =>
        sendSMS(user.phone, smsMessage)
      );
      await Promise.all(smsPromises);
      console.log("SMS alerts sent to all users.");
    } catch (smsError) {
      console.error("Error sending SMS alerts:", smsError);
    }

    res.status(201).json({ message: "Disaster report submitted successfully." });
  } catch (error) {
    console.error("Error reporting disaster:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
