const { Router } = require("express");
const router = Router();
const Cart= require('../allCarts/shoppingCart')
const itemDAO = require('../daos/items');


//adding items to cart
router.get("/:id", async (req,res,next) => {
    
  const itemId = req.params.id; 
  let cart = await new Cart(req.session.cart ? req.session.cart: {});
  item = await itemDAO.getById(itemId);
  cart.add(item, item.id);
  req.flash('success', 'Successfully added to cart!');
  req.session.cart = cart;
  res.redirect('/');

});


module.exports = router;