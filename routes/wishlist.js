const { Router } = require("express");
const router = Router();
const Cart= require('../allCarts/wishlistCart')
const wishlistDAO = require('../daos/wishlist')

//creating wishlist

router.get("/",  async(req,res,next)=> {

    if(!req.session.wishlistcart){
        return res.redirect('/wishlist-cart');
    }
    let cart = await new Cart(req.session.wishlistcart);
    res.render('shop/wishlist');

});


router.post('/', async function(req, res, next) {

   const cart = new Cart(req.session.wishlistcart);
   const cartItems = cart.getItems();
   const itemObjs = cartItems.map(function(cartItem) {
        return {
            itemId: cartItem.item._id,  
        }
   });
    const name =  req.body.name;
    const user = req.user;
    const wishlist = await wishlistDAO.create(user,itemObjs, name);
    req.flash('success', 'Successfully added items to wishlist!');    
    req.session.wishlistcart = null;
    res.redirect('/');
}); 




module.exports = router;