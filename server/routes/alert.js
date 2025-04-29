// routes/alert.js
import express from 'express';
import User from '../models/User.js';
import sendSMS from '../util/sendSMS.js';
import reverseGeocode from '../util/reverseGeocode.js';

const router = express.Router();

router.post("/report", async (req, res) => {
  const { disasterName, location, description } = req.body;

  try {
    let locationString = location;

    // Check if location is lat/lng object
    if (location && typeof location === "object" && location.latitude && location.longitude) {
      try {
        const readable = await reverseGeocode(location.latitude, location.longitude);
        if (readable) {
          locationString = readable;
        }
      } catch (geoError) {
        console.warn("Reverse geocoding failed. Using raw location.");
      }
    }

    const users = await User.find(); // Get ALL registered users

    const message = `🚨 ${disasterName} reported${locationString ? ` in ${locationString}` : ""}. ${description || ""}`;

    for (const user of users) {
      if (user.phone) await sendSMS(user.phone, message);
    }

    res.status(200).json({ message: "Disaster reported and alerts sent to all users." });
  } catch (err) {
    console.error("Error sending alerts:", err);
    res.status(500).json({ error: "Failed to send alerts." });
  }
});

export default router;
