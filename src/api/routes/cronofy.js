const cronofyRouter = require("express").Router();
const Cronofy = require("../models/cronofy");
// const getCronofyUserInfo = require("../../middleware/cronofyVerfiyAccessToken");
const getCronofy = require("../../middleware/cronofyVerfiyAccessToken");
// console.log(getCronofyUserInfo);
const axios = require("axios");
const {
  asyncHandler,
  validationHandler,
  verifyJwt,
  verifyRole,
} = require("../../middleware");

cronofyRouter.get("/findAll", async (req, res) => {
  try {
    const cronofy = await Cronofy.find({});
    console.log(cronofy);
  } catch (error) {}
});
cronofyRouter.get("/getUser", getCronofy, async (req, res) => {
  try {
    console.log("Get Availability Called");
  } catch (error) {
    res.json({ error });
  }
});
cronofyRouter.get("/availability", getCronofy, async (req, res) => {
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const subId = req.cronofyDataSub;
    const authToken = req.cronofyAccessToken;
    getAvailability(authToken, subId)
      .then((resp) => {
        res.status(200).json({ status: true, message: resp.data });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ status: false, message: error.message });
      });


    async function getAvailability(authToken, subId) {
      const requestData = {
        participants: [
          {
            members: [{ sub: subId }],
            required: "all",
          },
        ],
        required_duration: { minutes: 60 },
        available_periods: [
          {
            start: startDate,
            end: endDate,
          },
        ],
        response_format: "slots",
      };

      const response = await axios.post(
        "https://api.cronofy.com/v1/availability",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    }
  } catch (error) {
    res.json({ error });
  }
});
module.exports = cronofyRouter;
