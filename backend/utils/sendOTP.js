const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"IWB Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`
  });
};

module.exports = sendOTP;
