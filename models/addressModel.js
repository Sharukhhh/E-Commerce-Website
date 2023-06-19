const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    name: {
        type: String,
        required: true
    },

    phone:{
        type: Number,
        required: true,
    },

    pincode: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Address', addressSchema);