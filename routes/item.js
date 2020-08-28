const { Router }= require('express');
const router = Router();
const middleware = require('./middleware');


const itemDAO = require('../daos/items');


// Get home page



router.get("/", async (req,res,next) => {
  
  let successMsg = req.flash('success')[0];

  let itemChunks = [];
   itemsChunks = await itemDAO.getAll(itemChunks);
  res.render('shop/index', { title: 'Creamery-On-aClick', items: itemChunks,successMsg: successMsg, noMessages: !successMsg});
  
});


// create items


router.post("/",  middleware.isLoggedIn, isAdmin, async (req,res,next)=>{
  const itemTitle = req.body.title;
  const itemPrice = req.body.price;
  const itemDescription = req.body.description;
  const itemStory = req.body.story
  const itemSize = req.body.itemSize;
  const itemImagePath = req.body.imagePath;


  if(!itemTitle || !itemPrice || !itemDescription || !itemStory|| !itemSize || !itemImagePath ){
      res.status(400).send("Enter Item information")
      }else{
          const newItem = await itemDAO.create(itemTitle, itemPrice, itemDescription, itemStory, itemSize, itemImagePath );
          if(newItem){
              res.json(newItem);
          } else{
              res.status(409).send("Item already exists");
      }

  }
});





//update items

router.put("/:id", middleware.isLoggedIn, isAdmin, async(req,res,next) => {
  const itemId = req.params.id;
  const itemTitle = req.body.title;
  const itemPrice = req.body.price;
  const itemDescription = req.body.description;
  const itemStory = req.body.story
  const itemSize = req.body.itemSize;
  const itemImagePath = req.body.imagePath;

  const updatedItem = await itemDAO.updateItem(itemId, itemTitle, itemPrice, itemDescription, itemStory, itemSize, itemImagePath);
  if(updatedItem){
      res.json(updatedItem);
      successMsg = req.flash('success', 'Item updated');
      res.redirect('admin-layout/admin', {successMsg: successMsg, noMessages: !successMsg});
  }else{
      res.redirect('admin-layout/items')

  }

})

//delete item

router.delete("/:id", async (req, res, next) => {
  const itemId = req.params.id;
  const success = await itemDAO.deleteById(itemId);
  res.sendStatus(success ? 200 : 400);
  successMsg= req.flash('success', 'Item has been successfully deleted!');
  res.redirect('admin-layout/admin', {successMsg: successMsg, noMessages: !successMsg});
 
});


module.exports = router;