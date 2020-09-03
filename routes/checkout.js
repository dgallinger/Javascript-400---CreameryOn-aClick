require("dotenv").config(".env");

const { Router } = require("express");
const router = Router();
const Cart = require('../allCarts/shoppingCart');
const orderDAO = require('../daos/order.js')



// /checking if user is loggedin 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}


//getting checkout and creating order

router.get("/", isLoggedIn, async(req,res,next)=> {

    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    let cart = await new Cart(req.session.cart);
    res.render('shop/checkout', {total: cart.totalPrice});


});



router.post('/', isLoggedIn, async function(req, res, next) {

    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
   const cart = new Cart(req.session.cart);

   const cartItems = cart.getItems();
   const itemObjs = cartItems.map(function(cartItem) {
        return {
            itemId: cartItem.item._id,
            quantity: cartItem.qty
        }
   });
    const address =  req.body.address;
    const recipient = req.body.recipient;
    const user = req.user;
   
    const order = await orderDAO.create(user,itemObjs, address, recipient);
    req.flash('success', 'Successfully bought product!');    
    req.session.cart = null;
    res.redirect('/');

}); 


  





module.exports = router;