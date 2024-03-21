const servicesRouter = require("express").Router();
const { asyncHandler, verifyJwt, verifyRole } = require("../../middleware");
const { servicesController } = require("../controllers");

servicesRouter.get(
  "/findAll",
  verifyJwt,
  verifyRole("salonOwner", "admin"),
  asyncHandler(servicesController.findAll)
);
servicesRouter.get("/findOne/:id", asyncHandler(servicesController.findOne));
servicesRouter.post(
  "/create",
  // verifyJwt,
  // verifyRole("admin", "salonOwner"),
  asyncHandler(servicesController.addServices)
);
servicesRouter.delete(
  "/delete/:id",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(servicesController.deleteServices)
);

module.exports = servicesRouter;
