const { salonServices, userServices, stockServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const _ = require('lodash');

// @desc    Find all stock
// @route   GET /api/v1/stock/findAll
// @access  Private/Admin

exports.findAll = async (req, res, next) => {
  const filter = _.pick(req.query,['firstName','role']);
  const options = _.pick(req.query,['limit','page','perPage','populate']);

  const stock = await stockServices.findAll(filter,options);
  if (!stock) {
    return next(new ErrorResponse(`stock not found`, 400));
  }
  res.status(200).json({ success: true, count: stock.length, data: stock });
};

// @desc    Find one stock
// @route   GET /api/v1/stock/findOne/:id
// @access  Private/Admin

exports.findOne = async (req, res, next) => {
  const stock = await stockServices.findOne({ _id: req.params.id });
  if (!stock) {
    return next(new ErrorResponse(`No stock found`, 400));
  }
  res.status(200).json({ success: true, data: stock });
};

// @desc    Add stock
// @route   POST /api/v1/stock/add
// @access  Private/Admin

exports.addStock = async (req, res, next) => {
  // Check if the product exists in the stock than update the quantity
  const stockData = await stockServices.findOne({
    productId: req.body.productId,
  });
  if (stockData) {
    const stock = await stockServices.updateOne(
      { productId: req.body.productId },
      { quantity: req.body.quantity + stockData.quantity }
    );
    if (!stock) {
      return next(new ErrorResponse(`stock not found`, 400));
    }
    res.status(200).json({ success: true, data: stock });
  } else {
    const stock = await stockServices.create(req.body);
    if (!stock) {
      return next(new ErrorResponse(`stock not created`, 400));
    }
    res.status(200).json({ success: true, data: stock });
  }
};

// @desc    Update stock
// @route   PUT /api/v1/stock/update/:id
// @access  Private/Admin

exports.updateStock = async (req, res, next) => {
  const stock = await stockServices.update(req.params.id, req.body);
  if (!stock) {
    return next(new ErrorResponse(`stock not updated`, 400));
  }
  res.status(200).json({ success: true, data: stock });
};

// @desc    Delete stock
// @route   DELETE /api/v1/stock/delete/:id
// @access  Private/Admin

exports.deleteStock = async (req, res, next) => {
  const stock = await stockServices.delete(req.params.id);
  if (!stock) {
    return next(new ErrorResponse(`stock not deleted`, 400));
  }
  res
    .status(200)
    .json({ success: true, msg: "stock deleted successfully", data: stock });
};

// @desc    Remove stock quantity
// @route   PUT /api/v1/stock/removeQuantity/:id
// @access  Private/Admin

exports.removeQuantity = async (req, res, next) => {
  const stock = await stockServices.findOne({ _id: req.params.id });
  if (!stock) {
    return next(new ErrorResponse(`stock not found`, 400));
  }
  const newQuantity = stock?.quantity - req.body.quantity;
  if (newQuantity < 0) {
    return next(new ErrorResponse(`stock quantity is not enough`, 400));
  }
  const updatedStock = await stockServices.update(req.params.id, {
    quantity: newQuantity,
  });
  if (!updatedStock) {
    return next(new ErrorResponse(`stock not updated`, 400));
  }
  res.status(200).json({ success: true, data: updatedStock });
};
