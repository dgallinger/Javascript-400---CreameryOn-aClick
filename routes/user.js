const { Router }= require('express');
const router = Router();
const csrf = require('csurf');

const jwt = require("jsonwebtoken");
const secret = 'mount rainier';
const bcrypt = require('bcrypt');
const userDAO = require('../daos/users');



//csrf protection using as a middleware

const  csrfProtection = csrf();
router.use(csrfProtection);




//middleware for checking authorization

// const isAuthorized = async(req,res,next) => {
//     const auth =  req.headers.authorization;
//     if(!auth){
//         res.status(401).send("User not authorized");
//     }else{          
//         const token = auth.split(' ')[1];
//         try{
//             const user = jwt.verify(token, secret)
//             if (user) {
//                 req.user = user;
//                 next();
//             } else {
//             res.redirect('/');
//             }
//         }catch (error){
//             res.redirect('/');
//     }
    
// };


function isLoggedIn(req, res, next) {
    
    if (req.isAuthenticated()) {


        next();
    }
    else{
        res.redirect('/');
    }
}


function notLoggedIn(req, res, next) {
    
    if (!req.isAuthenticated()) {
        next();
    }
    else{
        res.redirect('/');
    }
}


router.get('/profile', isLoggedIn, async(req,res,next) => {
    res.render('user/profile');
  })

router.get('/logout', isLoggedIn,async(req,res,next) => {
    req.logout();
    res.redirect('/');
})


// redirecting not loggedin user

 
router.use('/', notLoggedIn, async(req,res,next) => {
    next();
});


 //signup



 router.get('/signup', async(req,res,next) => {
    const messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0 })
  
  });

router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;

    if (!password || password === " " ){
        req.flash('msg', 'Enter password');
        res.redirect('/signup');
        
    } else {
        const newUser = await userDAO.signUp(email, password);
        if(newUser){
            if (req.session.oldUrl) {
                // let oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect('/checkout');
            } else {
                res.redirect('/');
            }
            
        } else{
            req.flash('msg', 'Email exists');
            res.redirect('/signup');
    }
    
    }
});


//login

router.post("/", async (req, res ) => {
    const { email, password } = req.body;
    if (!password || password === '') {
        res.status(400).send('Please provide a password'); 
    } else {
        let savedUser = await userDAO.login(email);
        if (savedUser) {
            const validPass = await bcrypt.compare(password, savedUser.password);
            if (validPass) {
                savedUser = await userDAO.removePassword(email);
                try {
                    const token = jwt.sign(savedUser.toJSON(), secret);
                    res.json({ token });
                } catch (error) {
                    throw error;
                }
            } else {
                res.status(401).send("User not authorized");
            }
        } else {
            res.status(401).send("User not authorized");
        }
    }   
})


router.get('/logout', isLoggedIn,async(req,res,next) => {
    req.logout();
    res.redirect('/');
})


//change password

router.post("/password", async(req,res)=>{

    const {email} = req.user;
    const {password} = req.body;

    if (!password || password === ' ') {
        res.status(400).send('Please provide password');
    } else if (req.headers.authorization.includes('BAD')) {
        res.sendStatus(401);
    }
    else{
    const changePass = await userDAO.changePassword(email, password);
        if (changePass) {
	        res.status(200).send('Password changed');
	    } else {
	        res.status(401).send('Password not changed');
	        }
    }

});

// Error handling middleware
router.use(function (error, req, res, next){
    if(error.message.includes("Internal Server Error")){
        res.status(500).send("Sorry! Working on the fix");
    }
});





module.exports = router;







