const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController.js");
// const protectRoute = require("../../middleware/protectRoute.js");

const messageRouter = express.Router();

messageRouter.get("/:id", getMessages);
messageRouter.post("/send/:id", sendMessage);
module.exports = messageRouter;
