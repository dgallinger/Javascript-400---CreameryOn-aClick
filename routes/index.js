const { Router }= require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');

const Item = require('../models/items');

//csrf protection using as a middleware

let csrfProtection = csrf();
router.use(csrfProtection);

// Get home page
router.get("/", function(req,res,next) {
   Item.find(function(err, docs) {
     let itemChunks = [];
     let chunkSize = 3;
     for(let i=0; i < docs.length; i+= chunkSize){
       itemChunks.push(docs.slice(i, i+ chunkSize));
       
     }
     res.render('shop/index', { title: 'Creamery-On-aClick', items: itemChunks});
  });
});


//get signup

router.get('/user/signup', function(req,res,next){
  const messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0 })

});

// create user

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true

}));

router.get('/user/profile', function(req,res,next){
  res.render('user/profile');
})


module.exports = router;