const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname : {
        type: String,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }, 

    brand: {
        type: String,
        require: true
    },

    details: {
        type: String,
        required: true,
    },

    image: [{
        type: String,
        required: true,
    }],

    price : {
        type: Number,
        required: true
    },

    added_at: {
        type: Date,
        required: true,
        default: Date.now
    }

});

module.exports = mongoose.model('Product' , productSchema);