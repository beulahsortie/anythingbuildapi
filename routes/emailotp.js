// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Otp = require('../models/otp');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '3231811912y204@gmail.com',
    pass: 'hlnz tnya enpl mrlq',
  },
});

router.post('/send-otp', async (req, res) => {
  const { otpemail } = req.body;
  const otpCode = crypto.randomInt(100000, 999999).toString();

  await Otp.deleteMany({ otpemail }); // remove old OTPs
  await Otp.create({ otpemail, otp: otpCode });
  console.log("inside send otp....")
  await transporter.sendMail({
    to: otpemail,
    subject: 'Your OTP Code',
    text: `Your verification code is ${otpCode}`,
  });

  res.status(200).json({ message: 'OTP sent to email' });
});

router.post('/verify-otp', async (req, res) => {
    const { otpemail, otp } = req.body;
    const record = await Otp.findOne({ otpemail, otp });
  
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  
    // You can mark the user as verified here in your User model
    // await User.updateOne({ email }, { verified: true });
  
    await Otp.deleteMany({ otpemail }); // Clean up
    res.status(200).json({ message: 'Email verified successfully' });
  });
  
  module.exports = router;
  