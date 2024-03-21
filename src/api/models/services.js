const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


const servicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
  },
  details: {
    type: String,
  },
  price: {
    type: Number,
  },
  salon:{
    type:mongoose.SchemaTypes.ObjectId, ref: 'Salon'
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isDelete:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

servicesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Services", servicesSchema);
