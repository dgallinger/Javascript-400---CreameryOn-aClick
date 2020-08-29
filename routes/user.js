const { Router }= require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');
const middleware = require('./middleware');



//csrf protection using as a middleware

const  csrfProtection = csrf();
router.use(csrfProtection);

// redirecting loggedin user
router.get('/profile', middleware.isLoggedIn, async(req,res,next) => {
    res.render('user/profile');
  })

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

  

router.get('/signin', async (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    
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







