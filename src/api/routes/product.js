const productRouter = require("express").Router();
const { asyncHandler, verifyJwt, verifyRole } = require("../../middleware");
const { productController } = require("../controllers");

productRouter.get(
  "/findAll/:id",
  // verifyJwt,
  // verifyRole("admin"),
  asyncHandler(productController.getProducts)
);

productRouter.get("/findOne/:id", asyncHandler(productController.findOne));
productRouter.post(
  "/create",
  // verifyJwt,
  // verifyRole("admin"),
  asyncHandler(productController.createProduct)
);
productRouter.put(
  "/update/:id",
  verifyJwt,
  // verifyRole("admin"),
  asyncHandler(productController.updateProduct)
);
productRouter.delete(
  "/delete/:id",
  verifyJwt,
  // verifyRole("admin"),
  asyncHandler(productController.deleteProduct)
);

module.exports = productRouter;
