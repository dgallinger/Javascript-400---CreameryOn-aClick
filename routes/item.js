const { Router }= require('express');
const router = Router();
const Item = require('../models/items');



// Get home page



router.get("/", async (req,res,next) => {
    const successMsg = req.flash('success')[0]
    Item.find(function(err, docs) {
      let itemChunks = [];
      let chunkSize = 3;
      for(let i=0; i < docs.length; i+= chunkSize){
        itemChunks.push(docs.slice(i, i+ chunkSize));
        
      }
    res.render('shop/index', { title: 'Creamery-On-aClick', items: itemChunks, successMsg: successMsg, noMessages: !successMsg});
   });
  
   
});





module.exports = router;