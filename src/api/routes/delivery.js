const deliveryRouter = require("express").Router();
const { deliveryController } = require("../controllers/deliveryController")



deliveryRouter.post('/delivery', deliveryController);

module.exports = deliveryRouter;
