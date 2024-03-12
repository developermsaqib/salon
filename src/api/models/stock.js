const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const stockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isDelete:{
    type:Boolean,
    default:false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

stockSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Stock", stockSchema);
