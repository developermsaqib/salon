const { number } = require('joi');
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required:true
    },
    review:{
        type:String
    },
    userId: {
       type: mongoose.Schema.ObjectId,
       ref:"User"
    },
    serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: "Service"
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    salonId: {
        type: mongoose.Schema.ObjectId,
        ref: "Salon"
    }
},{timestamps:true})

const Rating = mongoose.model("Rating",ratingSchema);

module.exports = Rating;