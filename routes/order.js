const { Router } = require("express");
const router = Router();
const Item = require('../models/items');
const Order= require('../models/cart')




router.get("/:id", async (req,res,next) => {
    
    const itemId = req.params.id; 
    let cart = await new Order(req.session.cart ? req.session.cart: {});

    Item.findById(itemId, function(err, item){
        if (err){
            return res.redirect('/');
        }
        cart.add(item, item.id);
        req.flash('success', 'Successfully added to cart!');
        req.session.cart = cart;
        res.redirect('/');
    });
   


});


module.exports = router;