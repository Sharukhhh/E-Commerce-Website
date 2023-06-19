const {TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;


require('dotenv').config();

const User = require('../models/userModel');
const twilio = require('twilio');
const accountSid =process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});

const sendotp = async (req, res, next)=>{
    
    const {mobile} = req.body;
    req.session.mobile = mobile;
    
    try {
        const customer = await User.findOne({mobile: mobile});
        if(!customer){
            return res.render('otpLogin', {message: 'Number not registered'});
        }else{
            const otpResponse = await client.verify.v2
            .services(serviceId) 
            .verifications.create({
                to: '+91' + mobile,
                channel: 'sms',
          });
            console.log(otpResponse);
            res.render('otpLogin' , {message: 'OTP send successfully'});
        } 

    } catch (error) {
        console.log(error);
    }
};


const verifyOtp = async (req, res, next)=>{
    const verficationCode = req.body.otp;
    const mobile = req.session.mobile;

 
    try {
        const verification_check = await client.verify.v2.services(serviceId).verificationChecks.create({
            to: '+91'+ mobile, code: verficationCode
        });

        if(verification_check.status === 'approved'){
            const user = req.session.user;
            res.render('home', {user});
        }else{
            res.render('otpLogin', {message : 'Invalid OTP, Try again '});
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    sendotp,
    verifyOtp
}