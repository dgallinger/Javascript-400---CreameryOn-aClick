const { Router } = require("express");
const router = Router();

const Cart= require('../models/cart');



router.get('/:id', async(req, res, next) => {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

module.exports = router;