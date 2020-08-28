const { Router }= require('express');
const router = Router();

const userDAO = require('../daos/users');

router.get('/', async(req,res,next) =>{
   
    const messages = req.flash('error');
    res.render('user/change-password',{  messages: messages, hasErrors: messages.length>0 })
});

// change password

router.post("/",  async(req,res)=>{
    
    const {email} = req.user;
    const {password} = req.body;

    const changePass = await userDAO.changePassword(email, password);
        if (changePass) {
            
	        req.flash('success', 'password changed!');
            res.redirect('/');
	    } else {
            console.log("Failure")
	        res.redirect('/password');
	        
    }

});


module.exports = router;