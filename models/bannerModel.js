const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    cover: {
        type: String,
        required: true
    },    

    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Banner' , bannerSchema);