
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },   
      
    email: {
        type: String,
        required: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },

    mobile: {
        type: String,
        required: true,
        match: /^[1-9]\d{9}$/
    },

    password: {
        type: String,
        required: true
    },

    is_blocked: {
        type: Boolean,
        default: false
    },

    registered_At : {
        type: Date,
        required: true,
        default: Date.now
    },

    address: [{
        name: String,
        phone: Number,
        pincode: Number,
        state: String,
        district: String, 
        add: String
    }],

    coupon: [String]          

});

module.exports = mongoose.model('User', userSchema);    

