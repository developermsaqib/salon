const stockRouter = require("express").Router();
const { asyncHandler, verifyJwt, verifyRole } = require("../../middleware");
const { stockController } = require("../controllers");

stockRouter.get(
  "/findAll",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.findAll)
);

stockRouter.get(
  "/findOne/:id",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.findOne)
);

stockRouter.post(
  "/add",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.addStock)
);

stockRouter.put(
  "/update/:id",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.updateStock)
);

stockRouter.delete(
  "/delete/:id",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.deleteStock)
);

stockRouter.put(
  "/removeQuantity/:id",
  verifyJwt,
  verifyRole("admin"),
  asyncHandler(stockController.removeQuantity)
);

module.exports = stockRouter;
