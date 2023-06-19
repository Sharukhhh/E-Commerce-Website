const User = require('../models/userModel');
const isLoggedIn = async (req, res, next)=>{
    if(req.session.user){
        next();
    }else{
        res.redirect('/');
    }
}


const isLogged = async (req, res, next)=>{
    if(req.session.user){
        res.redirect('/');
    }else{
        next();
    }
}

const isBlocked = async (req, res, next) => {
    try {
      if (req.session.user) {
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        if (user.is_blocked) {
          const flashMessage = 'Access Denied, You are Blocked!!';
        //   req.session.flash = flashMessage;
          req.session.save(() => {
            res.redirect('/login');
          });
          return;
        }
      }
      res.locals.flash = req.flash();
      next();
    } catch (error) {
      
      console.error('Error in isBlocked middleware:', error);
      next(error);
    }
  };
  

module.exports = {
    isLoggedIn,
    isLogged,
    isBlocked
}