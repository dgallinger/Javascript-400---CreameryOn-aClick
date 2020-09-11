const { Router }= require('express');
const router = Router();
const passport = require('passport');
const middleware = require('./middleware');
const orderDAO = require('../daos/order');
const wishlistDAO = require('../daos/wishlist');
const userDAO = require('../daos/users');



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



//wishlist

// get all wishlists for a user
router.get('/profile/wishlists', middleware.isLoggedIn, async(req,res,next) => {
  let successMsg = req.flash('success')[0];
  let errorMsg = req.flash('error')[0];
  userId = req.user.id;
  wishlists = await wishlistDAO.getAllByUserId(userId);
  res.render('user/wishlists', {wishlists: wishlists,successMsg: successMsg, noMessages: !successMsg, errorMsg: errorMsg, noErrMessages: !errorMsg});


});

// update wishlist


router.get('/profile/wishlists/update/:id', async(req,res,next) =>{
   
const wishlistId = req.params.id;

res.render('user/wishlist-update', {_id: wishlistId})
});

router.post('/profile/wishlists/update/:id', async(req,res,next) => {
  const wishlistId = req.params.id;
  const {name} = req.body;
  updatedItem = await wishlistDAO.updateWishlist(wishlistId, name);
  req.flash('success', 'Wishlist name has been updated!');  
  res.redirect('/user/profile/wishlists');
});



//deleteing a wishlist


router.get("/profile/wishlists/:id", middleware.isLoggedIn, async (req, res, next) => {
  const wishlistId = req.params.id;
  const success = await wishlistDAO.deleteById(wishlistId);
  req.flash('success', 'Wishlist has been successfully deleted!');
  res.redirect('/user/profile');
  
});



// get user profile
router.get('/profile', middleware.isLoggedIn, async(req,res,next) => {
  let successMsg = req.flash('success')[0];
  res.render('user/profile', {successMsg: successMsg, noMessages: !successMsg});

});


//rendering password change page
router.get('/change-password', async(req,res,next) =>{
   
  const messages = req.flash('error');
  res.render('user/change-password',{  messages: messages, hasErrors: messages.length>0 })
});

// change password

router.post("/change-password",  async(req,res)=>{
    
  const {email} = req.body.user;
  const {password} = req.body;

  const changePass = await userDAO.changePassword(email, password);
      if (changePass) {
          
        req.flash('success', 'password changed!');
          res.redirect('/');
    } else {
          
        res.redirect('/user/change-password');
        
  }

});



// user logout

router.get('/logout', middleware.isLoggedIn,async(req,res,next) => {
    req.logout();
    req.session.cart = null;
    req.flash('success', 'User has logged-out');    
    res.redirect('/');
})


 // redirecting not loggedin user
 
 router.use('/', middleware.notLoggedIn, async(req,res,next) => {
     next();
 });


//get signup

router.get('/signup', async(req,res,next) => {
    
    const messages = req.flash('error');
    req.session.save(() => {
      res.render('user/signup', {  messages: messages, hasErrors: messages.length>0 });
    })
   // res.render('user/signup', {  messages: messages, hasErrors: messages.length>0 })
  
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
      req.flash('success', 'Login Successful'); 
      res.redirect('/');
}
});

  
// get signin
router.get('/signin', async (req, res, next) => {
    
    const messages = req.flash('error');
    // csrfToken: req.csrfToken(),
    
    res.render('user/signin', {  messages: messages, hasErrors: messages.length > 0});
    
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
        req.flash('success', 'Login Successful'); 
        res.redirect('/');
        
    }}
  });

module.exports = router;
