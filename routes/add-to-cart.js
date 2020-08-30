const { Router } = require("express");
const router = Router();
const Cart= require('../models/cart')
const itemDAO = require('../daos/items');



router.get("/:id", async (req,res,next) => {
    
  const itemId = req.params.id; 
  let cart = await new Cart(req.session.cart ? req.session.cart: {});
  item = await itemDAO.getById(itemId);
  cart.add(item, item.id);
  req.flash('success', 'Successfully added to cart!');
  req.session.cart = cart;
  res.redirect('/');

});




/*
 * Get an order by id
 * GET /orders/:id
 * + Return an order with the items array containing the full Item objects (including quantity).
 * + Normal user: can only retrieve an order they made; otherwise 404.
 * + Admin user: can retrieve any order.
 */
/*
router.get("/:id", 
  middleware.isUserAuthenticated,
  async (req, res, next) => {
    try 
    {
      const orderId = req.params.id;
      if (!orderId || orderId === '') { 
        res.status(400).send('id param value is required'); 
        return; 
      }
  
      const order = await orderDAO.getById(orderId);
      if (!order) {
        res.sendStatus(404); 
        return;
      }
      //if neither an admin nor the user's order
      const reqUser = req.user;
      if (!reqUser.roles.includes(middleware.roleNameAdmin) 
        && String(order.userId) !== reqUser.id) {
        res.sendStatus(404);
        return;
      }

      res.json(order);
  } 
  catch(err) 
  {
    next(err);
  }
});
*/



module.exports = router;