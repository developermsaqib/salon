// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');
// const User = require('./api/models/User.js')
const userServices = require('./api/services/userServices.js');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate OTP function
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

// API endpoint for sending OTP
app.post('/send-otp/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log(userServices);
    try {
        const findUser = await userServices.findOne({_id:id});
        res.json({user:findUser})
        
    } catch (error) {
        res.json({msg:error});
    }
    try {
        // if (!findUser) {
        //     return res.status(404).json({ error: 'User not found' });
        // }
        const phoneNumber = findUser.phoneNumber;
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const otp = generateOTP();
       const updateUser =  await userServices.update({_id: id}, {otp: otp}); // Update user with OTP
        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your OTP is ${updateUser.otp}`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// API endpoint for verifying OTP
app.post('/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const storedOTP = otpStorage[phoneNumber];
    if (!storedOTP) {
        return res.status(404).json({ error: 'OTP not found. Please resend OTP.' });
    }

    if (otp === storedOTP) {
        // OTP matched
        delete otpStorage[phoneNumber]; // Remove OTP from storage after successful verification
        return res.json({ message: 'OTP verified successfully' });
    } else {
        // OTP did not match
        return res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
