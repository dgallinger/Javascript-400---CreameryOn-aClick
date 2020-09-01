const { Router }= require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');
const middleware = require('./middleware');
const orderDAO = require('../daos/order');
const wishlistDAO = require('../daos/wishlist');
const wishlist = require('../models/wishlist');




//csrf protection using as a middleware

const  csrfProtection = csrf();
router.use(csrfProtection);

//getting user orders

router.get('/profile/orders', middleware.isLoggedIn, async(req,res,next) => {
  
  userId = req.user.id;
  orders = await orderDAO.getAllByUserId(userId);
  res.render('user/orders', {orders: orders});

});

//get order by id //pending rendering
router.get("/profile/orders/:id", 
  middleware.isLoggedIn,
  async (req, res, next) => {
    try 
    {
      const orderId = req.params.id;
      console.log(orderId)
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
      
      res.render('user/orderById', { order: order});
  } 
  catch(err) 
  {
    next(err);
  }
});

// get all wishlists for a user
router.get('/profile/wishlists', middleware.isLoggedIn, async(req,res,next) => {
  userId = req.user.id;
  wishlists = await wishlistDAO.getAllByUserId(userId);
  res.render('user/wishlists', {wishlists: wishlists});


});

//rendering wishlist update page

// router.get('/profile/wishlists/:id', middleware.isLoggedIn, async(req,res,next) => {
//   console.log("********");
//   console.log(req.body.name);
//   res.render('user/wishlist_update');

// });

// //updating a wishlist- not working not finding route

// router.put('/profile/wishlists/:id'), middleware.isLoggedIn, async(req,res,next) => {
//   const wishlistId = req.params.id;
//   const {name} = req.body;
//   updatedItem = await wishlistDAO.updateWishlist(wishlistId, name);
//   res.redirect('/user/profile');
// }


//deleteing a wishlist


  router.get("/profile/wishlists/:id", middleware.isLoggedIn, async (req, res, next) => {
    const wishlistId = req.params.id;
    console.log("Inside wishlist")
    const success = await wishlistDAO.deleteById(wishlistId);
    console.log(success)
    req.flash('success', 'Wishlist has been successfully deleted!');
    res.redirect('/user/profile');
    

  });





// get user profile
router.get('/profile', middleware.isLoggedIn, async(req,res,next) => {
  
  res.render('user/profile');

});



// user logout

router.get('/logout', middleware.isLoggedIn,async(req,res,next) => {
    req.logout();
    req.session.cart = null;
    req.flash('success', 'User has been logged-out');    
    res.redirect('/');
})


 // redirecting not loggedin user
 
 router.use('/', middleware.notLoggedIn, async(req,res,next) => {
     next();
 });


//get signup

router.get('/signup', async(req,res,next) => {
    
    const messages = req.flash('error');
    // csrfToken: req.csrfToken()
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0 })
  
  });
  
// create user
  
router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
  
  }), function (req, res, next) {
    if (req.session.oldUrl) {
        // let oldUrl = req.session.oldUrl
        req.session.oldUrl = null;
        res.redirect('/checkout');
    } else {
        res.redirect('/user/profile');
}
});

  
// get signin
router.get('/signin', async (req, res, next) => {
    
    const messages = req.flash('error');
    // csrfToken: req.csrfToken(),
    
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    
    req.session.cart;
  });

 // user signin 
  
router.post('/signin', passport.authenticate('local.signin', {
   
    failureRedirect: '/user/signin',
    failureFlash: true
  
  }), function (req, res, next) {
    admin = req.user.roles;
    if (req.session.oldUrl) {
        // let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/checkout');
        
        
    } else{ 
        if (admin[0] == "admin")
        {
        res.redirect('/admin');
        }
        else{
        res.redirect('/user/profile');
        
    }}
  });


module.exports = router;
