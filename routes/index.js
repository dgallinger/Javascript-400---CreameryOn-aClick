const { Router }= require('express');
const router = Router();

const Item = require('../models/items')

// Get home page
router.get("/", function(req,res,next) {
   Item.find(function(err, docs) {
     let itemChunks = [];
     let chunkSize = 3;
     for(let i=0; i < docs.length; i+= chunkSize){
       itemChunks.push(docs.slice(i, i+ chunkSize));
       
     }
     res.render('shop/index', { title: 'CreameryOn-aClick', items: itemChunks});

    
});

});







module.exports = router;