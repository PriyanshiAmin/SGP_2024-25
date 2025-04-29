import express from "express"
import verifyRecaptcha from "../util/verifyRecaptcha.js";
import Volunteer from "../models/Volunteer.js"

const router = express.Router()

router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, skills, availability, recaptchaToken } = req.body

  const isHuman = await verifyRecaptcha(recaptchaToken)
  if (!isHuman) {
    return res.status(400).json({ message: "reCAPTCHA failed. Please try again." })
  }

  try {
    const newVolunteer = new Volunteer({
      firstName,
      lastName,
      email,
      phone,
      skills,
      availability,
    })

    await newVolunteer.save()
    res.status(200).json({ message: "Volunteer application submitted successfully." })
  } catch (err) {
    console.error("Error saving volunteer:", err)
    res.status(500).json({ message: "Server error. Please try again later." })
  }
})

export default router
