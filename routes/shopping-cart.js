
const { Router } = require("express");
const router = Router();
const Order= require('../models/cart')



router.get("/",async(req,res,next) => {
    
    
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {items: null});
    }
    let cart = await new Order(req.session.cart);
    res.render('shop/shopping-cart', {items: cart.generateArray(), totalPrice: cart.totalPrice});
    
})





module.exports = router;