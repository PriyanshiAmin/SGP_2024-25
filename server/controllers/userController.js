import User from '../models/User'; // Import the User model

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request (from the JWT token)
    const { name, email, phone, address, emergencyContact } = req.body;

    // Validate input (optional)
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address, emergencyContact },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user data
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
