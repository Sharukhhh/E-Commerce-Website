const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    createdDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    expiryDate: {
        type: Date,   
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: Boolean,
        default: false   
    }
});

module.exports = new mongoose.model('Offers', offerSchema );