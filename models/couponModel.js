const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },

    discount: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
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

    status: {
        type: Boolean,
        default: false   
    }
});

module.exports = new mongoose.model('Coupon' , couponSchema);   
