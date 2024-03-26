const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    dealName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    servicesIncluded: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Services' 
        }
    ],
    applicableDays: {
        type: [String],
        default: []
    },
    applicableTimes: {
        type: {
            start: String,
            end: String
        },
        default: {}
    },
    applicableLocations: {
        type: [String],
        default: []
    },
    minimumPurchaseAmount: {
        type: Number,
        default: 0
    },
    maximumRedemptionPerCustomer: {
        type: Number,
        default: 1
    },
    termsAndConditions: {
        type: String,
        default: ""
    }
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
