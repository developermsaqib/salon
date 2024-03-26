// controllers/packages.js
const { Package } = require('../models');

// Controller for creating a new package
exports.createPackage = async (req, res) => {
  try {
    const package = await Package.create(req.body);
    res.status(201).json(package);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package' });
  }
};

// Controller for fetching all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// controllers/deals.js
// const { Deal } = require('../models');

// exports.createDeal = async (req, res) => {
//   try {
//     const deal = await Deal.create(req.body);
//     res.status(201).json(deal);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create deal' });
//   }
// };

// Controller for fetching all deals
// exports.getAllDeals = async (req, res) => {
//   try {
//     const deals = await Deal.find();
//     res.json(deals);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch deals' });
//   }
// };
