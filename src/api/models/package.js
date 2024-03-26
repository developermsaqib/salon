const mongoose = require('mongoose');


const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service' 
  }],
  
}, { timestamps: true });


const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service' 
  }],
 
}, { timestamps: true });


const Package = mongoose.model('Package', packageSchema);
const Deal = mongoose.model('Deal', dealSchema);

module.exports = { Package, Deal };
