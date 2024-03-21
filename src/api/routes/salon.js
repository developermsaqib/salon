const salonRouter = require("express").Router();
const upload = require('../../middleware/multer');

const {
  asyncHandler,
  validationHandler,
  verifyJwt,
  verifyRole,
} = require("../../middleware");
const { salonController, staffController } = require("../controllers");

salonRouter.get(
  "/findAll",
  // verifyJwt,
  // verifyRole("admin"),
  asyncHandler(salonController.findAll)
);
salonRouter.get("/findOne/:id", asyncHandler(salonController.findOne));
salonRouter.post(
  "/create",
  // verifyJwt,
  // verifyRole("admin", "salonOwner"),
  // upload.array('pictures'),
  asyncHandler(salonController.addSalon)
);
salonRouter.delete(
  "/delete/:id",
  // verifyJwt,
  // verifyRole("salonOwner"),
  asyncHandler(salonController.deleteSalon)
);
salonRouter.patch(
  "/update/:id",
  verifyJwt,
  verifyRole("salonOwner"),
  asyncHandler(salonController.updateSalon)
);

salonRouter.patch(
  "/updateServices/:id",
  verifyJwt,
  verifyRole("salonOwner"),
  asyncHandler(salonController.updateServices)
);

salonRouter.patch(
  "/removeServices/:id",
  verifyJwt,
  verifyRole("salonOwner"),
  asyncHandler(salonController.deleteServices)
);

// Staff Apis starts here
salonRouter.post(
  "/staff/create",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(staffController.addStaff)
);

salonRouter.get(
  "/staff/findAll",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(staffController.findAll)
);

salonRouter.get("/staff/findOne/:id", asyncHandler(staffController.findOne));
salonRouter.delete(
  "/staff/delete/:id",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(staffController.deleteStaff)
);

salonRouter.patch(
  "/staff/update/:id",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(staffController.updateStaff)
);

module.exports = salonRouter;
