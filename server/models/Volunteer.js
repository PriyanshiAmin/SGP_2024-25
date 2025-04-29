// models/Volunteer.js
import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  skills: { type: String },
  availability: {
    type: String,
    enum: ["weekdays", "weekends", "evenings", "on-call"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
