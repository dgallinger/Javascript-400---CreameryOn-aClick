
const { Router } = require("express");
const router = Router();
const Cart= require('../allCarts/shoppingCart')



router.get("/", async(req,res,next) => {
    
    
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {items: null});
    }
    let cart = await new Cart(req.session.cart);
    res.render('shop/shopping-cart', {items: cart.getItems(), totalPrice: cart.totalPrice});
    
})





module.exports = router