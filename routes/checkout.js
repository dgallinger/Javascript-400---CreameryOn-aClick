require("dotenv").config(".env");

const { Router } = require("express");
const router = Router();
const csrf = require('csurf');
const Cart = require('../models/cart');



const  csrfProtection = csrf();
router.use(csrfProtection);

// /checking if user is loggedin 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}




router.get("/", isLoggedIn, async(req,res,next)=> {

    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    let cart = await new Cart(req.session.cart);
    res.render('shop/checkout', {total: cart.totalPrice});


});





  


module.exports = router;