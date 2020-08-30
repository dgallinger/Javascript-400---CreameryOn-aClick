const { Router } = require("express");
const router = Router();

const ShoppingCart= require('../allCarts/shoppingCart');
const wishlistCart= require('../allCarts/wishlistCart')



router.get('/:id', async(req, res, next) => {
    var itemId = req.params.id;
    if(req.session.wishlistcart){
        console.log("insidewishlist")
        const cart = new wishlistCart(req.session.wishlistcart  ? req.session.wishlistcart : {});   
        cart.removeItem(itemId);
        req.session.wishlistcart = cart;
        res.redirect('/wishlist-cart');
    }
    else{
        const cart = new ShoppingCart(req.session.cart ? req.session.cart : {});

        cart.removeItem(itemId);
        req.session.cart = cart;
        res.redirect('/shopping-cart');

    }
});



module.exports = router;