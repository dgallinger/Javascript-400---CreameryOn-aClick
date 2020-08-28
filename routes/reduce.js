const { Router } = require("express");
const router = Router();

const Order= require('../models/cart');



router.get('/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Order(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

module.exports = router;