import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';  // Import moment.js for date handling
import Admin from '../models/Admin.js';
import User from '../models/User.js'; 
import DisasterReport from '../models/DisasterReport.js'; 
import Volunteer from '../models/Volunteer.js'; 
import authenticateAdmin from '../middleware/authenticateAdmin.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Admin Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists in the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send back the token along with a success message
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// New verify endpoint to check token validity
router.get('/verify', async (req, res) => {
  try {
    // Verify the JWT token
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({ valid: true });
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route to fetch real data (Admin stats) - now using authenticateAdmin middleware
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Fetch the real stats from the database
    const userCount = await User.countDocuments(); // Count all users
    const disasterReportCount = await DisasterReport.countDocuments(); // Count all disaster reports
    const volunteerCount = await Volunteer.countDocuments(); // Count all volunteers

    // Send the actual data as response
    res.status(200).json({
      users: userCount,
      reports: disasterReportCount,
      volunteers: volunteerCount,
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Route to fetch chart data for admin (disaster reports by date) - now using authenticateAdmin middleware
router.get('/chartdata', authenticateAdmin, async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Check if start and end dates are provided, if not, set defaults
    const start = startDate ? moment(startDate) : moment().startOf('month');
    const end = endDate ? moment(endDate) : moment().endOf('month');

    // Fetch disaster reports within the date range
    const reports = await DisasterReport.find({
      createdAt: { $gte: start.toDate(), $lte: end.toDate() }
    });

    // Fetch user data
    const users = await User.find({
      createdAt: { $gte: start.toDate(), $lte: end.toDate() }
    });

    // Fetch volunteer data
    const volunteers = await Volunteer.find({
      createdAt: { $gte: start.toDate(), $lte: end.toDate() }
    });

    // Prepare data for charts
    const reportData = [];
    const userData = [];
    const volunteerData = [];

    // Group reports by date
    for (let date = moment(start); date.isSameOrBefore(end); date.add(1, 'days')) {
      const dateStr = date.format('YYYY-MM-DD');
      
      // Reports for this date
      const reportCount = reports.filter(report =>
        moment(report.createdAt).format('YYYY-MM-DD') === dateStr
      ).length;
      
      // Users registered on this date
      const userCount = users.filter(user =>
        moment(user.createdAt).format('YYYY-MM-DD') === dateStr
      ).length;
      
      // Volunteers registered on this date
      const volunteerCount = volunteers.filter(volunteer =>
        moment(volunteer.createdAt).format('YYYY-MM-DD') === dateStr
      ).length;
      
      reportData.push({ date: dateStr, count: reportCount });
      userData.push({ date: dateStr, count: userCount });
      volunteerData.push({ date: dateStr, count: volunteerCount });
    }

    // Send the chart data to the frontend
    res.status(200).json({
      reports: reportData,
      users: userData,
      volunteers: volunteerData,
    });
  } catch (err) {
    console.error('Error fetching chart data:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;