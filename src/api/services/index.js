const userServices = require("./userServices");
const salonServices = require("./salonServices");
const services = require("./servicesSalon");
const productServices = require("./productServices");
const stockServices = require("./stockServices");
const appointmentServices = require("./appointmentServices");
const categoryServices = require("./categoryServices");
const staffServices=require("./staffServices")
const deliveryServices =require("./deliveryServices")

module.exports = {
  categoryServices,
  userServices,
  salonServices,
  services,
  productServices,
  stockServices,
  appointmentServices,
  staffServices,
  deliveryServices
};
