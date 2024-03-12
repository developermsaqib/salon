const router = require("express").Router();
const userRouter = require("./user");
const salonRouter = require("./salon");
const servicesRouter = require("./services");
const productRouter = require("./product");
const stockRouter = require("./stock");
const appointmentRouter = require("./appointment");
const authRouter = require("./auth");
const deliveryRouter =require("./delivery")
const paymentRouter =require("./payment")

router.use("/api/v1/user", userRouter);
router.use("/api/v1/salon", salonRouter);
router.use("/api/v1/services", servicesRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/stock", stockRouter);
router.use("/api/v1/appointment", appointmentRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/delivery", deliveryRouter);
router.use("/api/v1/payment", paymentRouter);

module.exports = router;
