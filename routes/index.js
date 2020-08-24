const { Router } = require("express");
const router = Router();
const Item = require('../models/items');
const Order= require('../models/order')

router.use("/user", require("./user"));

router.use("/", require("./item"));

router.use("/about", function(req,res,next){
    res.render('shop/about')
})

router.use("/contact", function(req,res,next){
    res.render('shop/contact')
})

router.use("/order/:id", function(req,res,next){
    const itemId = req.params.id; 
    let cart = new Order(req.session.cart ? req.session.cart: {});

    Item.findById(itemId, function(err, item){
        if (err){
            return res.redirect('/');
        }
        cart.add(item, item.id);
        req.session.cart = cart;
        res.redirect('/');
        console.log(req.session.cart)
    });


});


router.use("/shopping-cart", function(req,res,next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {items: null});
    }
    let cart = new Order(req.session.cart);
    res.render('shop/shopping-cart', {items: cart.generateArray(), totalPrice: cart.totalPrice});
})



module.exports = router;