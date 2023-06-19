const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    item: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,       
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],

    total: {
        type: Number,
        required: true,
        min: 0,
    },
    
    status: {
        type: String,
        enum: ['Pending' , 'Processing' , 'Shipped' , 'Delivered', 'Cancelled', 'Returned' ,'Refunded'],
        required: true
    },

    payment_way : {
        type: String,
        required: true
    },

    createdAt: {                                    
        type: Date,
        default: Date.now
    },

    address: {
        type: Object,
        required: true,
    },
    isCancelled: {
        type: Boolean,
        default: false
    },

    reason: {
        type: String  
    }
});

module.exports = mongoose.model('Order', orderSchema, 'Odrer');


