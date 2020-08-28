const { Router }= require('express');
const router = Router();
// const csrf = require('csurf');
const passport = require('passport');

const userDAO = require('../daos/users');

//csrf protection using as a middleware

// const  csrfProtection = csrf();
// router.use(csrfProtection);


//checking if user is loggedin 
const isLoggedIn= async(req, res, next) => {
    
    if (req.isAuthenticated()) {


        next();
    }
    else{
        res.redirect('/');
    }
}


const notLoggedIn= async(req, res, next) => {
    
    if (!req.isAuthenticated()) {
        next();
    }
    else{
        res.redirect('/');
    }
}

const isAdmin = async(req,res,next) => {
    if(req.user.roles.includes('admin')) {
        next();
    }
    else{
        res.sendStatus(403);
    }

};
// redirecting loggedin user
router.get('/profile', isLoggedIn, async(req,res,next) => {
    res.render('user/profile');
  })

router.get('/logout', isLoggedIn,async(req,res,next) => {
    req.logout();
    req.session.cart = null;
    res.redirect('/');
})


 // redirecting not loggedin user

 
 router.use('/', notLoggedIn, async(req,res,next) => {
     next();
 });


//get signup

router.get('/signup', async(req,res,next) => {
    const messages = req.flash('error');
    res.render('user/signup', {  messages: messages, hasErrors: messages.length>0 })
  
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
    res.render('user/signin', {  messages: messages, hasErrors: messages.length > 0});
    
    req.session.cart;
  });
  
router.post('/signin', passport.authenticate('local.signin', {
   
    failureRedirect: '/user/signin',
    failureFlash: true
  
  }), function (req, res, next) {
    admin = req.user.roles
    console.log("Admin:", admin)
    console.log(req.session.oldUrl)
    if (req.session.oldUrl) {
        // let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/checkout');
        
    } else{ 
        if (admin[0] == "admin")
        {
        console.log("inside-else if")
        console.log(req.user.roles)
        res.redirect('/admin');
        }

        else{
    
        console.log("inside-else ")
        res.redirect('/user/profile');
        console.log(req.user.roles)
    }}
  });




    





  




module.exports = router;







