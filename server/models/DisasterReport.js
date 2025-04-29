import mongoose from "mongoose";

// Assuming you have a User model already
const disasterReportSchema = new mongoose.Schema({
  disasterName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  severity: { type: String },
  description: { type: String },
  contact: { type: String },
  media: [String],
  reportedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, 
}, { timestamps: true });

const DisasterReport = mongoose.model("DisasterReport", disasterReportSchema);
export default DisasterReport;
