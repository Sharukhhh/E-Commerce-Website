const User = require('../models/userModel');


const loadLogin = async (req, res)=>{
    try {
        const user = req.session.user;
        res.render('login', {user});
    } catch (error) {
        console.log(error);
    }
}


const loadRegister = async(req, res)=>{
    try {
        const user = req.session.user;
        res.render('register', {user});
    } catch (error) {
        console.log(error);
    }
}


const registerUser = async (req, res)=>{
    try{
        const { name, email, mobile, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
                return res.render('register', { message: 'Passwords do not match. Please try again.' });
            }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        
        if(!emailRegex.test(email)){
            return res.render('register' , {message : 'Invalid Email Entry. Retry'});
        }

        const mobileRegex = /^[1-9]\d{9}$/;

        if(!mobileRegex.test(mobile)){
            return res.render('register' , {message : 'Invalid phone number input. Retry'});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.render('register', {message: 'Password requirements do not match. Retry'});
        }

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mobile,
            password : spassword,
            is_blocked : false
        });

        const userData = await user.save();

        if(userData){
            return res.redirect('/login');
        }
        return res.render('register' , {message : 'Failed to Register, Try again!'});

    } catch (error) {
        console.log(error);
    }
}



    const verfiyUserLogin = async (req,res)=> {
        try {
            const email =  req.body.email;
            const password = req.body.password;

            const userData = await User.findOne({email : email});

            if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if(passwordMatch){
                
                    if(userData.is_blocked){
                        return res.render('login' , {message: 'Your Account is Blocked!!'});
                    }


                    req.session.user = userData;

                    
                    return res.redirect('/user');
            }else{
                return res.render('login', {message : 'Incorrect email or Password, Try again'});
            }

            }else{
            return res.render('login', {message : 'Incorrect email or Password, Try again'});
            }

        } catch (error) {
            console.log(error);
        }
    };

const logout = async (req, res)=>{
    try {
        req.session.user=false;
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadLogin , loadRegister, logout,
    registerUser , verfiyUserLogin
}