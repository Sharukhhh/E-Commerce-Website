const { MongoGridFSChunkError } = require("mongodb");

const isLogged = async (req, res, next)=> {
    try {
        if(req.session.admin){
            res.redirect('/admin/dashboard');
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
    }  
}


const isAdminLoggedIn = async (req, res, next) => {
    try {
        if(req.session.admin){
            next();     
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    isLogged,
    isAdminLoggedIn
}