const { Router } = require("express");
const router = Router();
const Cart= require('../allCarts/shoppingCart')
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




//Please uncomment and make any necessary updates for front-end integration.

/*
 * Create
 * POST /orders
 * + Open to all (authenticated) users.
 * + Takes an array of Item Detail objects consisting of Item._id and quantity 
 *   (repeat values should not occur).
 * + Order.total is computed as the sum of all items' current price multipled by their quantity.
 * + The order contains the User.userId of the user placing the order.
 */
// router.post("/", 
//   middleware.isUserAuthenticated, 
//   async (req, res, next) => {
//     try
//     {
//       const userId = req.userId;
//       const items = req.body;
//       if (!items || !items.length) { 
//         res.status(400).send('order requires at least one item'); 
//         return; 
//       }

//       const createdOrder = await orderDAO.create(userId, items);
//       res.json(createdOrder);
//     }
//     catch(err)
//     {
//       if (err instanceof orderDAO.BadDataError) {
//         res.status(400).send(err.message);
//       } else {
//         next(err);
//       }
//     }
//   }
// );

 
/*
 * Get an order by id
 * GET /orders/:id
 * + Return an order with the items array containing the full Item objects (including quantity).
 * + Normal user: can only retrieve an order they made; otherwise 404.
 * + Admin user: can retrieve any order.
 */
// router.get("/:id", 
//   middleware.isUserAuthenticated,
//   async (req, res, next) => {
//     try 
//     {
//       const orderId = req.params.id;
//       if (!orderId || orderId === '') { 
//         res.status(400).send('id param value is required'); 
//         return; 
//       }
  
//       const order = await orderDAO.getById(orderId);
//       if (!order) {
//         res.sendStatus(404); 
//         return;
//       }
//       //if neither an admin nor the user's order
//       const reqUser = req.user;
//       if (!reqUser.roles.includes(middleware.roleNameAdmin) 
//         && String(order.userId) !== reqUser.id) {
//         res.sendStatus(404);
//         return;
//       }

//       res.json(order);
//   } 
//   catch(err) 
//   {
//     next(err);
//   }
// });


/*
 * Get my orders
 * GET /orders
 * + Normal user: return all orders made by the user making the request.
 * + Admin user: return all orders.
 */
// router.get("/", 
//   middleware.isUserAuthenticated, 
//   async (req, res, next) => {
//     try
//     {
//       const reqUser = req.user;
//       let orders;
//       if (req.user.roles.includes(middleware.roleNameAdmin)) { 
//         orders = await orderDAO.getAll();
//       } else {
//         orders = await orderDAO.getAllByUserId(reqUser.id);
//       }

//       res.json(orders);
//     }
//     catch(err)
//     {
//       next(err);
//     }
// });


/*
 * Update my order
 * PUT /orders/:id
 * + Can only update an order if its status is still in New state.
 * + Order.total will need to be re-computed.
 * + Normal user: can only update an order they made; otherwise 404.
 * + Admin user: can update any order.
 */
// router.put("/:id",  
//   middleware.isUserAuthenticated, 
//   async (req, res, next) => {
//   try
//   {
//     const reqOrderId = req.params.id;
//     const reqUser = req.user;
//     const reqItems = req.body;

//     if (!reqItems || JSON.stringify(reqItems) === '{}' ) {
//       res.status(400).send('order is required');
//       return;
//     }

//     const existingOrder = await orderDAO.getById(reqOrderId);
//     if (!existingOrder) {
//       res.sendStatus(404); //order not found
//     }

//     if (existingOrder.status !== 'New') {
//       res.status(400).send('order has been processed and cannot be modified'); 
//       return; 
//     }

//     //if not an Admin and not the user's order
//     if (!reqUser.roles.includes(middleware.roleNameAdmin) 
//       && String(existingOrder.userId) !== reqUser.id) {
//       res.sendStatus(404);
//       return;
//     }

//     await orderDAO.updateById(reqOrderId, reqItems);
//     res.sendStatus(200); 
//   }
//   catch(err)
//   {
//     next(err);
//   }
// });


/*
 * Cancel my order
 * DELETE /orders/:id
 * + Can only cancel an order if its status is still in New state.
 * + Normal user: can only cancel an order they made; otherwise 404.
 * + Admin user: can cancel any order.
 */
// router.delete("/:id",  
//   middleware.isUserAuthenticated, 
//   async (req, res, next) => {
//   try
//   {
//     const reqOrderId = req.params.id;
//     const reqUser = req.user;

//     const existingOrder = await orderDAO.getById(reqOrderId);
//     if (!existingOrder) {
//       res.sendStatus(404); //order not found
//     }

//     if (existingOrder.status !== 'New') {
//       res.status(400).send('order has been processed and cannot be modified'); 
//       return; 
//     }

//     //if not an Admin and not the user's order
//     if (!reqUser.roles.includes(middleware.roleNameAdmin) 
//       && String(existingOrder.userId) !== reqUser.id) {
//       res.sendStatus(404);
//       return;
//     }

//     await orderDAO.cancelById(reqOrderId);
//     res.sendStatus(200); 
//   }
//   catch(err)
//   {
//     next(err);
//   }
// });



module.exports = router;