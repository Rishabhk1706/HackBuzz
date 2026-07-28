import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"HackBuzz" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;