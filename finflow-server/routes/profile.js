const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const auth    = require('../middleware/authMiddleware');
const User    = require('../models/User');

// All routes require login
router.use(auth);

// ── GET /api/profile ───────────────────────────────────────────────────────
// Returns current user's profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/profile ───────────────────────────────────────────────────────
// Update name and/or avatar (base64 image string)
router.put('/', async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name)   updates.name   = name;
    if (avatar !== undefined)     updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password -otp -otpExpires');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/profile/change-password ──────────────────────────────────────
// Change password — requires old password verification
router.put('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Get user with password
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Verify old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    // 3. Hash new password and save
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
