const Delivery = require('../models/delivery')

const deliveryServices = async ({ cart, formData }) => {
  const delivery = new Delivery({ cart, formData });
    await delivery.save();

  };
  
  module.exports = deliveryServices;