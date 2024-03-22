const ratingServices = require("../services/ratingServices");
const services = require("../services/servicesSalon");
const productServices = require("../services/productServices");
const { Services, Product, Salon } = require("../models");
const Rating = require("../models/rating");
const mongoose = require("mongoose");

exports.addRating = async (req, res) => {
  try {
    const { rating, review, serviceId, productId, userId } = req.body;
    let salonId;
    if (serviceId) {
      const service = await Services.findOne({ _id: serviceId });
      salonId = service.salon;
    } else if (productId) {
      const product = await Product.findOne({ _id: productId });
      salonId = product.salon;
    }
    if (salonId) {
      console.log(salonId);
      if (productId) {
        const ratingDoc = await Rating.create({
          rating: rating,
          review: review,
          salonId: salonId,
          productId: productId,
          userId: userId,
        });
        return res.status(201).json({ status: true, ratingDoc });
      } else if (serviceId) {
        const ratingDoc = await Rating.create({
          rating: rating,
          review: review,
          salonId: salonId,
          serviceId: serviceId,
          userId: userId,
        });
        return res.status(201).json({ status: true, ratingDoc });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.topSalons = async (req, res) => {
  
  try {
    const topSalon = await Rating.aggregate([
      {
        $group: {
          _id: "$salonId",
          rating: { $avg: "$rating" },
          ratingAndReviews: { $sum: 1 } 
        }
      },
      {
        $project: {
          rating: {$round:["$rating",1]}
        }
      },
      {
        $sort: { rating: -1 }
      },
      {
        $limit: 5 
      },
      {
        $lookup: {
          from: "salons", 
          localField: "_id",
          foreignField: "_id",
          as: "salonData"
        }
      },
      {
        $unwind: "$salonData"
      },
      {
        $project: {
          "_id": "$salonData._id",
          "name": "$salonData.name",
          "address": "$salonData.address",
          "location":"$salonData.location",
          "pictures":"$salonData.pictures",
          "business_hours":"$salonData.business_hours",
          "city":"$salonData.city",
          "service":"$salonData.service",
          "status":"$salonData.status",
          "isDelete":"$salonData.isDelete",
          "createdAt":"$salonData.createdAt",
          "updatedAt":"$salonData.updatedAt",
          "rating": 1,
          "ratingAndReviews": 1
        }
      }
    ]);  
    res.status(200).json({
      topSalons: topSalon,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
};
exports.findRating = async (req, res) => {
  const salonId = req.params.id;
  try {
    const ratingsCollection = await Rating.find({ salonId });
    let totalRating = 0;
    ratingsCollection.forEach((rating) => {
      totalRating += rating.rating;
    });

    const averageRating = totalRating / ratingsCollection.length;
    ratingsCollection.rating = averageRating;
    res.status(200).json({
      status:true,
      salonWithRating: ratingsCollection,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
};
