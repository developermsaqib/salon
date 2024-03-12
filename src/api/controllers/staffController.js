const { staffServices, userServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const _ = require("lodash");
const { uploadToAws, deleteFromAWS } = require("./../../utils/aws.helper");

exports.findAll = async (req, res, next) => {
  const filter = _.pick(req.query, ["", ""]);
  const options = _.pick(req.query, [""]);

  const staff = await staffServices.findAll(filter, options);
  if (!staff) {
    return next(new ErrorResponse(`salon not found`, 400));
  }
  res.status(200).json({ success: true, count: staff.length, data: staff });
};

exports.addStaff = async (req, res, next) => {
  if (req.files.length > 0) {
    const awsData = await uploadToAws(
      req.files[0].buffer,
      req.files[0].originalname
    );
    req.body.profile_pic = awsData.Location;
  }
  // put url in req.body
  const { id } = req.user;
  // put user id in req.body
  req.body.userId = id;
  const staff = await staffServices.create(req.body);
  if (!staff) {
    return next(new ErrorResponse(`Staff not created`, 400));
  }
  res.status(200).json({ success: true, data: staff });
};

exports.findOne = async (req, res, next) => {
  const staff = await staffServices.findOne({ _id: req.params.id });
  if (!staff) {
    return next(new ErrorResponse(`No Staff found`, 400));
  }
  res.status(200).json({ success: true, data: staff });
};

exports.deleteStaff = async (req, res, next) => {
  const staffForProfileDelete = await staffServices.findOne({
    _id: req.params.id,
  });
  if (staffForProfileDelete.profile_pic) {
    const awsDeletedData = await deleteFromAWS(
      staffForProfileDelete.profile_pic
    );
  }
  const staff = await staffServices.delete(req.params.id);
  if (!staff) {
    return next(new ErrorResponse(`salon not deleted`, 400));
  }
  res.status(200).json({ success: true, data: staff, message: "Deleted" });
};

exports.updateStaff = async (req, res, next) => {
  const staffForProfileDelete = await staffServices.findOne({
    _id: req.params.id,
  });
  console.log("find one data for update", staffForProfileDelete);
  if (staffForProfileDelete.profile_pic) {
    console.log("got profile pic");
    const awsDeletedData = await deleteFromAWS(
      staffForProfileDelete.profile_pic
    );
    console.log("Deleted AWS Data:", awsDeletedData);
  }

  if (req.files.length > 0) {
    console.log("files exists: ", req.files);
    const awsData = await uploadToAws(
      req.files[0].buffer,
      req.files[0].originalname
    );
    req.body.profile_pic = awsData.Location;
  } else {
    console.log("files doesnot exists: ", req.files);
    req.body.profile_pic = "";
  }

  const staff = await staffServices.update(req.params.id, req.body);
  if (!staff) {
    return next(new ErrorResponse(`salon not updated`, 400));
  }
  res.status(200).json({ success: true, data: staff });
};
