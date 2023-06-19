const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }],

    balance: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    transactions: [{
        type: String,
        required: true
    }]
});


module.exports = mongoose.model('Wallet', walletSchema);