const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  price: { type: Number, required: [true, "Price is required"], trim: true },
  productImage: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  details: { type: String },
  type: { type: String },
  salon: { type: mongoose.SchemaTypes.ObjectId, ref: "Salon" },
  isDelete: { type: Boolean, default: false }
  
},{timestamps:true});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
