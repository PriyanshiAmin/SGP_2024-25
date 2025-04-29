// import express from 'express';
// import User from '../models/User.js';
// import sendEmail from '../util/sendEmail.js';

// const router = express.Router();

// router.post('/alert-all', async (req, res) => {
//   const { subject, message } = req.body;

//   try {
//     const users = await User.find({}, 'email'); // only get emails
//     const emails = users.map((user) => user.email);

//     const result = await sendEmail(
//       emails,
//       subject || 'Disaster Alert 🚨',
//       `<p>${message || 'This is a test disaster alert.'}</p>`
//     );

//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     res.status(200).json({ success: true, data: result.data });
//   } catch (err) {
//     console.error("Error in /alert-all route:", err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// export default router;
// routes/emailAlert.js
import express from "express";
import sendEmail from "../util/sendEmail.js";
import reverseGeocode from "../util/reverseGeocode.js";

const router = express.Router();

router.post("/email-alert", async (req, res) => {
  const { email, disasterName, location, description } = req.body;

  if (!email || !disasterName) {
    return res.status(400).json({ error: "Missing email or disaster name" });
  }

  let locationString = location;

  // Try reverse geocoding if lat/lng is passed
  if (location && typeof location === "object" && location.latitude && location.longitude) {
    try {
      const readable = await reverseGeocode(location.latitude, location.longitude);
      if (readable) {
        locationString = readable;
      }
    } catch (err) {
      console.warn("Reverse geocoding failed. Using raw location.");
    }
  }

  try {
    await sendEmail(email, disasterName, locationString, description);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

export default router;
