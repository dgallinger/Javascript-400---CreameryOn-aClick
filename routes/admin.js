
const { Router } = require("express");
const router = Router();

const itemDAO = require('../daos/items');

const isAdmin = async(req,res,next) => {
  if(req.user.roles.includes('admin')) {
      next();
  }
  else{
      res.sendStatus(403);
  }

};

const isLoggedIn = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
  }
  


router.get("/", async(req,res,next) => {
    
    res.render('admin-layout/admin')
})



router.get("/items", isLoggedIn, async(req,res,next)=>{

    if(req.user.roles.includes('admin')){
        let successMsg = req.flash('success')[0];
        let itemChunks = [];
        await itemDAO.getAll(itemChunks);
        res.render('admin-layout/items', {items: itemChunks,successMsg: successMsg, noMessages: !successMsg})

    }
    else{
    messages = req.flash('error', 'Not Authorized!');
    res.redirect('/');
    }
})


router.get("/orders", isLoggedIn, async(req,res,next)=>{

    if(req.user.roles.includes('admin')){
        res.render('admin-layout/orders')
    }
    else{
    req.flash('error', 'Not Authorized!');
    res.redirect('/');
    }
})


module.exports = router;
