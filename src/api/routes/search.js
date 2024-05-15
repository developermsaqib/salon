const express = require("express");
const { getSalonByName, getSalonById } = require("../controllers/search");

const searchRouter = express.Router();
searchRouter.get("/:term", getSalonByName);
searchRouter.get("/salon/:id", getSalonById);

module.exports = searchRouter;
