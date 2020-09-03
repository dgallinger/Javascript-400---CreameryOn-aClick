const { Router } = require("express");
const router = Router();

const Cart= require('../allCarts/shoppingCart');

//rednering and reducing item quantity

router.get('/:id', async(req, res, next) => {
    var itemId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(itemId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

module.exports = router;