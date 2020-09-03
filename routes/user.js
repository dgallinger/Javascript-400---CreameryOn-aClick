const { Router }= require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');
const middleware = require('./middleware');
const orderDAO = require('../daos/order');
const wishlistDAO = require('../daos/wishlist');
// const app = require('../server');


// app.use(passport.initialize());
// app.use(passport.session());

//csrf protection using as a middleware

//const  csrfProtection = csrf();
//router.use(csrfProtection);



router.get('/profile/orders', middleware.isLoggedIn, async(req,res,next) => {
  
  userId = req.user.id;
  orders = await orderDAO.getAllByUserId(userId);
  res.render('user/orders', {orders: orders});

});

router.get('/profile/wishlists', middleware.isLoggedIn, async(req,res,next) => {
  userId = req.user.id;
  wishlists = await wishlistDAO.getAllByUserId(userId);
  res.render('user/wishlists', {wishlists: wishlists});


});


router.get('/profile', middleware.isLoggedIn, async(req,res,next) => {
  
  res.render('user/profile');

});








router.get('/logout', middleware.isLoggedIn,async(req,res,next) => {
    req.logout();
    req.session.cart = null;
    res.redirect('/');
})

 // redirecting not loggedin user

 
 router.use('/', middleware.notLoggedIn, async(req,res,next) => {
     next();
 });


//get signup

router.get('/signup', async(req,res,next) => {
    
    const messages = req.flash('error');
    res.render('user/signup', { messages: messages, hasErrors: messages.length>0 })
  
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

router.get('/signin', async (req, res, next) => {
    
    const messages = req.flash('error');
    
    res.render('user/signin', { messages: messages, hasErrors: messages.length > 0});
    
    req.session.cart;
  });
  
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
