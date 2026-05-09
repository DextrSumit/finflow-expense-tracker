const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User     = require('../models/User');

// ── Force IPv4 globally (Render free tier blocks IPv6) ─────────────────────
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// ── Email transporter ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log('✅ SMTP connection verified — emails will work'))
  .catch(err => console.error('❌ SMTP connection FAILED:', err.message));

// ── Helper: generate 6-digit OTP ─────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // "382910"
}

// ── Helper: send OTP email ────────────────────────────────────────────────
async function sendOTPEmail(email, otp) {
  console.log(`[OTP] Attempting to send OTP to ${email}...`);
  console.log(`[OTP] EMAIL_USER set: ${!!process.env.EMAIL_USER}, EMAIL_PASS set: ${!!process.env.EMAIL_PASS}`);

  try {
    const info = await transporter.sendMail({
      from: `"FinFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your FinFlow Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #4CAF50; margin-bottom: 8px;">FinFlow</h2>
          <p style="color: #333; font-size: 15px;">Your email verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1a1d23; margin: 20px 0; text-align: center;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #bbb; font-size: 12px;">If you didn't create a FinFlow account, ignore this email.</p>
        </div>
      `,
    });
    console.log(`[OTP] ✅ Email sent successfully! MessageId: ${info.messageId}`);
  } catch (emailErr) {
    console.error(`[OTP] ❌ Email send FAILED:`, emailErr.message);
    console.error(`[OTP] Full error:`, emailErr);
    throw emailErr; // re-throw so caller can handle it
  }
}

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates user, sends OTP — does NOT verify yet
// ─────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already registered
    const exists = await User.findOne({ email });
    if (exists && exists.isVerified) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Generate OTP + expiry (10 minutes from now)
    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // 3. Hash OTP before storing (same principle as passwords)
    const hashedOTP  = await bcrypt.hash(otp, 10);

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. If user exists but unverified → update their record
    //    If new user → create fresh record
    if (exists && !exists.isVerified) {
      exists.name       = name;
      exists.password   = hashedPassword;
      exists.otp        = hashedOTP;
      exists.otpExpires = otpExpires;
      await exists.save();
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        otp: hashedOTP,
        otpExpires,
      });
    }

    // 6. Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      // User was saved but email failed — still return success with warning
      // so user can use "Resend OTP" on the verify screen
      console.error('Register: User saved but OTP email failed:', emailErr.message);
      return res.status(201).json({
        message: 'Account created but we could not send the verification email. Please use "Resend OTP" on the next screen.',
        email,
        emailFailed: true,
      });
    }

    res.status(201).json({
      message: 'Registration successful! Check your email for the 6-digit verification code.',
      email, // send back email so frontend can pre-fill the verify form
    });

  } catch (err) {
    console.error('Register error:', err.message);
    console.error('Register full error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Accepts { email, otp } → marks user as verified
// ─────────────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified. Please login.' });
    }

    // 3. Check OTP expiry
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // 4. Compare OTP with stored hash
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // 5. Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp        = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 6. Auto-login: return token so user lands on dashboard immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Email verified successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error('Verify OTP error:', err.message);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// Accepts { email } → generates and sends a fresh OTP
// ─────────────────────────────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user)            return res.status(404).json({ message: 'User not found' });
    if (user.isVerified)  return res.status(400).json({ message: 'Email already verified' });

    // 2. Generate fresh OTP
    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP  = await bcrypt.hash(otp, 10);

    // 3. Update user record
    user.otp        = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();

    // 4. Send email
    await sendOTPEmail(email, otp);

    res.json({ message: 'A new OTP has been sent to your email.' });

  } catch (err) {
    console.error('Resend OTP error:', err.message);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Blocks login if email not verified
// ─────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Block if not verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified. Please check your inbox for the OTP.',
        needsVerification: true, // flag so frontend can redirect to OTP screen
        email,
      });
    }

    // 4. Issue token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

module.exports = router;