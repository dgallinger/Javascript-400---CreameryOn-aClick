const { Router }= require('express');
const router = Router();


const userDAO = require('../daos/users');



router.get("/", async(req,res,next)=> {
  console.log('inside get change password')

  res.render("/user/changepassword");
})


// // change password

// router.post("/",  async(req,res)=>{

//   console.log('inside change password')

//   const {email} = req.user;
//   const {password} = req.body;

//   if (!password || password === ' ') {
//     res.render('/user/change-password',{  messages: messages, hasErrors: messages.length > 0})
//   } 
//   else{
//   const changePass = await userDAO.changePassword(email, password);
//       if (changePass) {
//         req.flash('success', 'Password updated');
//       res.render('/',)
     
//     } else {
     
//         res.status(401).send('Password not changed');
//         }
//   }

// });


module.exports = router;