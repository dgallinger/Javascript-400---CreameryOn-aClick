const { Router } = require("express");
const router = Router();

const Order= require('../models/cart')


router.use("/user", require("./user"));
router.use("/order", require("./order"));
router.use("/about", require("./about"));
router.use("/contact", require("./contact"));
router.use("/shopping-cart", require("./shopping-cart"));
router.use("/checkout", require("./checkout"));
router.use("/change-password",require("./change-password"))


router.use("/", require("./item"));


router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Order(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Order(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});








module.exports = router;