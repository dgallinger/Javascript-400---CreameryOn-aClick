const { Router }= require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');

//csrf protection using as a middleware

const  csrfProtection = csrf();
router.use(csrfProtection);





//checking if user is loggedin 
function isLoggedIn(req, res, next) {
    console.log("Inside is logged in")
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated())

        next();
    }
    else{
        res.redirect('/');
    }
}


function notLoggedIn(req, res, next) {
    console.log("not Inside is logged in")
    if (!req.isAuthenticated()) {
        next();
    }
    else{
        res.redirect('/');
    }
}

// redirecting loggedin user
router.get('/profile', isLoggedIn, function(req,res,next){
    res.render('user/profile');
  })

router.get('/logout', isLoggedIn,function(req,res,next){
    req.logout();
    res.redirect('/');
})


 // redirecting not loggedin user

 
 router.use('/', notLoggedIn, function(req,res,next){
     next();
 });


//get signup

router.get('/signup', function(req,res,next){
    const messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0 })
  
  });
  
// create user
  
router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  
  }));
  

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  
  // }), function (req, res, next) {
  //   if (req.session.oldUrl) {
  //       var oldUrl = req.session.oldUrl;
  //       req.session.oldUrl = null;
  //       res.redirect(oldUrl);
  //   } else {
  //       res.redirect('/user/profile');
  //   }
  }));




module.exports = router;







