const Salon = require("../models/salon");
const Services = require("../models/services");

async function getSalonByName(req, res) {
  try {
    const searchTerm = req.params.term;
    const salonsByName = await Salon.find({
      businessName: { $regex: searchTerm, $options: "i" },
    });
    const servicesByName = await Services.find({
      name: { $regex: searchTerm, $options: "i" },
    }).populate("salon");
    const salonsByService = servicesByName
      .map((service) => service.salon)
      .filter((salon) => salon != null);
    const salons = [...salonsByName, ...salonsByService];
    res.json({ salons: salons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getSalonById(req, res) {
  try {
    const searchId = req.params.id;
    const salonsWithServices = await Salon.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "salon",
          as: "services",
        },
      },
    ]);
    const foundSalon = salonsWithServices.find(
      (salon) => salon._id == searchId
    );
    res.json({ salons: foundSalon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getSalonByName,
  getSalonById,
};
