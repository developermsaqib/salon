const appointmentRouter = require("express").Router();
const { asyncHandler, verifyJwt, verifyRole } = require("../../middleware");
const getCronofy = require("../../middleware/cronofyVerfiyAccessToken");
const { appointmentController } = require("../controllers");

appointmentRouter.get(
  "/findAll",
  // verifyJwt,
  // verifyRole("admin", "customer"),
  asyncHandler(appointmentController.getAppointments)
);
appointmentRouter.get(
  "/findAll/:status",
  // verifyJwt,
  // verifyRole("admin", "customer"),
  asyncHandler(appointmentController.getAppointmentsByStatus)
);
appointmentRouter.get(
  "/findOne/:id",
  verifyJwt,
  verifyRole("admin", "customer"),
  asyncHandler(appointmentController.getAppointment)
);
appointmentRouter.post(
  "/create",
  // verifyJwt,
  // verifyRole("admin", "customer"),
  // getCronofy,
  asyncHandler(appointmentController.createAppointment)
);

appointmentRouter.post(
  "/availability",
  asyncHandler(appointmentController.getAvailability)
);
appointmentRouter.put(
  "/update/:id",
  verifyJwt,
  verifyRole("admin", "customer"),
  asyncHandler(appointmentController.updateAppointment)
);
appointmentRouter.delete(
  "/delete/:id",
  verifyJwt,
  verifyRole("admin", "customer"),
  asyncHandler(appointmentController.deleteAppointment)
);

module.exports = appointmentRouter;
