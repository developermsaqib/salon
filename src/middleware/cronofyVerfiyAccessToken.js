const Cronofy = require("../api/models/cronofy");
const axios = require("axios");

async function getCronofyUserInfo(accessToken) {
  try {
    if (accessToken) {
      const resp = await axios.get("https://api.cronofy.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return resp;
    }
  } catch (error) {
    return error;
  }
}

async function getCronofyAccessToken(refreshToken) {
  try {
    const response = await axios.post("https://api.cronofy.com/oauth/token", {
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to get access token");
  }
}

const getCronofy = async (req, res, next) => {
  const cronofy = await Cronofy.findOne({});
  accessToken = cronofy.accessToken;
  getCronofyUserInfo(accessToken).then((resp) => {
    if (resp.status === 200) {
      req.cronofyAccessToken = accessToken;
      req.cronofyDataSub = resp.data.sub;

      const profiles = resp.data["cronofy.data"].profiles;
      const googleProfile = profiles.find(profile => profile.provider_name === 'google');
      if (googleProfile) {
        const googleCalendar = googleProfile.profile_calendars[0]; 
        const googleCalendarId = googleCalendar.calendar_id;
        req.cronofyGoogleCalendarId = googleCalendarId;
    }
      // profiles.forEach((profile) => {
      //   if (profile.provider_name === "google") {
      //     profile.profile_calendars.forEach((calendar) => {
      //       console.log("Google Calendar ID:", calendar.calendar_id);
      //     });
      //   }
      // });

      next();
    } else if (resp.response.status === 401) {
      getCronofyAccessToken(process.env.CRONOFY_REFRESH_TOKEN).then(
        async (authToken) => {
          const cronofy = await Cronofy.findOne();
          cronofy.accessToken = authToken;
          await cronofy.save();
          getCronofyUserInfo(authToken).then((resp) => {
            if (resp.status === 200) {
              req.cronofyAccessToken = authToken;
              req.cronofyDataSub = resp.data.sub;
            }
            next();
          });
        }
      );
    }
  });
  // .catch(resp => {
  //   console.log(resp);
  //   if(resp){
  //     // req.cronofyStatus = error.status;
  //     console.log("Get Access Token Called", resp);
  //     next()
  //   }
  // })
};

module.exports = getCronofy;
