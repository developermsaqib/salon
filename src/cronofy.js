const express = require('express');
const axios = require('axios');
require('dotenv').config({path:'../.env'});

const app = express();
app.use(express.json())

async function getAccessToken(refreshToken) {
    try {
        const response = await axios.post('https://api.cronofy.com/oauth/token', {
            client_id: process.env.CRONOFY_CLIENT_ID,
            client_secret: process.env.CRONOFY_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response.data);
        throw new Error('Failed to get access token');
    }
}

// Example usage
const refreshToken = process.env.CRONOFY_REFRESH_TOKEN;

getAccessToken(refreshToken)
    .then(access_token => {
        console.log('Access Token:', access_token);
        // Use the access token for further requests
    })
    .catch(error => {
        // Handle error
    });

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
