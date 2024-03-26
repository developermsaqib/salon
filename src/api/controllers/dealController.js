const Deal = require('../models/deal');

exports.createDeal = async (req, res) => {
    try {
        const deal = new Deal(req.body);
        await deal.save();
        res.status(201).json({status:true,deal});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllDeals = async (req, res) => {
    try {
        const deals = await Deal.find().populate("servicesIncluded");
        res.status(200).json({status:true,deals});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).populate("servicesIncluded");
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json({status:true,deal});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json({status:true,deal});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json({ status:true,message: 'Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
