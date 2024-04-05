
const axios = require("axios");
const refreshToken = process.env.CRONOFY_REFRESH_TOKEN;


async function getAccessToken(refreshToken) {
    try {
      const response = await axios.post("https://api.cronofy.com/oauth/token", {
        client_id: process.env.CRONOFY_CLIENT_ID,
        client_secret: process.env.CRONOFY_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting access token:", error.response.data);
      throw new Error("Failed to get access token");
    }
  }


  getAccessToken(refreshToken)
    .then(access_token => {
        console.log('Access Token:', access_token);
    })
    .catch(error => {
        // Handle error
    });
