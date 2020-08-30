const { Router } = require("express");
const router = Router();
const Cart= require('../allCarts/wishlistCart')



router.get("/", async(req,res,next) => {
    
    let cart = await new Cart(req.session.wishlistcart);
    if(!req.session.wishlistcart){
        return res.render('shop/wishlist-cart', {items: null});
    }
    res.render('shop/wishlist-cart', {items: cart.getItems()});
    
})





module.exports = router;