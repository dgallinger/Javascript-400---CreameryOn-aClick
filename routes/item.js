const { Router }= require('express');
const router = Router();
const middleware = require('./middleware');


const itemDAO = require('../daos/items');




// Get home page



router.get("/", middleware.isPublic, async (req,res,next) => {

  let successMsg = req.flash('success')[0];
  let errorMsg = req.flash('error')[0];

  let itemChunks = [];
  itemsChunks = await itemDAO.getAll(itemChunks);
  res.render('shop/index', { title: 'Creamery-On-aClick', items: itemChunks, successMsg: successMsg, noMessages: !successMsg, errorMsg: errorMsg, noErrMessages: !errorMsg});
  
});




module.exports = router;