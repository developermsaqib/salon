const { services, salonServices, productServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const _ = require('lodash');

// @desc      Get all products
// @route     GET /api/v1/product/findAll
// @access    Private/Admin

exports.getProducts = async (req, res, next) => {
  const filter = _.pick(req.query,['type','price','title']);
  const options = _.pick(req.query,['limit','page','perPage','populate']);
  
  const products = await productServices.findAll(filter,options);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
};

// @desc      Get single product
// @route     GET /api/v1/product/findOne/:id
// @access    Private/Admin

exports.getProduct = async (req, res, next) => {
  const product = await productServices.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: product });
};

// @desc      Create new product
// @route     POST /api/v1/product/create
// @access    Private/Admin

exports.createProduct = async (req, res, next) => {
  const product = await productServices.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
};

// @desc      Update product
// @route     PUT /api/v1/product/update/:id
// @access    Private/Admin

exports.updateProduct = async (req, res, next) => {
  let product = await productServices.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 400)
    );
  }
  product = await productServices.update(req.params.id, req.body);

  res.status(200).json({ success: true, data: product });
};

// @desc      Delete product
// @route     DELETE /api/v1/product/delete/:id
// @access    Private/Admin

exports.deleteProduct = async (req, res, next) => {
  const product = await productServices.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 400)
    );
  }
  await productServices.delete(req.params.id);
  res.status(200).json({
    success: true,
    msg: "product delete successfully",
    data: product,
  });
};



