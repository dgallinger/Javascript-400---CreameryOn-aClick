const { Router } = require("express");
const router = Router();
const wishlistCart= require('../allCarts/wishlistCart')
const itemDAO = require('../daos/items');



router.get("/:id", async (req,res,next) => {

  if (!req.isAuthenticated()){
    console.log("not logged in")
    req.flash('error', 'Please login');
    res.redirect('/');

  }
  
    const itemId = req.params.id; 
    console.log(req.session.wishlistcart)
    let cart = await new wishlistCart(req.session.wishlistcart ? req.session.wishlistcart: {});
    item = await itemDAO.getById(itemId);
    cart.add(item, item.id);
    req.flash('success', 'Successfully added! Click on wishlist to save');
    req.session.wishlistcart = cart;
    res.redirect('/');
  

});


module.exports = router;