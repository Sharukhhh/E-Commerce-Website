const mongoose = require('mongoose');

const categrySchema = mongoose.Schema({
    categname: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Category' , categrySchema); 