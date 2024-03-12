const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const {SMTP_HOST,SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD} = process.env;

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST, 
    port: SMTP_PORT, 
    secure: true, 
    auth: {
      user: SMTP_EMAIL, 
      pass: SMTP_PASSWORD, 
    },
  });

module.exports = transporter;
