const ratingServices = require("../services/ratingServices");
const services = require("../services/servicesSalon");
const productServices = require("../services/productServices");
const { Services, Product, Salon } = require("../models");
const Rating = require("../models/rating");
const mongoose = require("mongoose");

exports.addRating = async (req, res) => {
  try {
    // const rating = await ratingServices.create(req.body);
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
exports.addRatingToSalon = async (req, res) => {
  try {
    const { rating, review, serviceId, productId, userId } = req.body;
    const addRating = await ratingServices.create(req.body);
    if (serviceId) {
      const salon = await Salon.findOne({
        service: mongoose.Types.ObjectId(serviceId),
      });
      if (!(salon.rating >= 1)) {
        const updateSalonRating = await Salon.updateOne(
          { service: serviceId },
          { $set: { rating } }
        );
        console.log(updateSalonRating);
      } else {
        const prevRating = salon.rating;
        const avgRating = (prevRating + rating) / 2;
        const roundRating = avgRating.toFixed(1);
        const updateSalonRating = await Salon.updateOne(
          { service: serviceId },
          { $set: { rating: roundRating } }
        );
        console.log(updateSalonRating);
      }
    }

    res
      .status(201)
      .json({ status: true, rating, review, serviceId, productId, userId });
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
    const topSalon = await Services.aggregate([
      {
        $lookup: {
          from: "ratings",
          let: { serviceId: "$_id", productId: "$productId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$serviceId", "$$serviceId"] },
                    { $eq: ["$productId", "$$productId"] },
                  ],
                },
              },
            },
          ],
          as: "ratings",
        },
      },
      { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } }, // Preserve services with no ratings
      {
        $group: {
          _id: "$salon",
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      {
        $sort: { averageRating: -1 }, // Sort by averageRating in descending order
      },
      {
        $limit: 3, // Limit the result to the top salon
      },
      {
        $lookup: {
          from: "salons", // Assuming the collection name is "salons"
          localField: "_id",
          foreignField: "_id",
          as: "salon",
        },
      },
      { $unwind: "$salon" },
    ]);

    console.log(topSalon);

    console.log(topSalon);

    res.json({
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

    console.log("Average Rating:", averageRating);
    res.json({
      salonRating: ratingsCollection,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
};
