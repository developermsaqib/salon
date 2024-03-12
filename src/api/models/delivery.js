const mongoose = require('mongoose');




const deliverySchema = new mongoose.Schema({
  cart: [{
    id: String,
    name: String,
    price: String
  }],
  formData: {
    name: String,
    mail: String,
    country: String,
    city: String,
    address: String,
    deliveryDay: String,
    deliveryTime: String,
    note: String,

  },

});



module.exports = mongoose.model('Delivery', deliverySchema);

