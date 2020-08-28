const { Router }= require('express');
const router = Router();
// const Item = require('../models/items');

const itemDAO = require('../daos/items');

const isAdmin = async(req,res,next) => {
  if(req.user.roles.includes('admin')) {
      next();
  }
  else{
      res.sendStatus(403);
  }

};


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

// Get home page



router.get("/", async (req,res,next) => {
  var successMsg = req.flash('success')[0];
  let itemChunks = [];
  await itemDAO.getAll(itemChunks);
  
  res.render('shop/index', { title: 'Creamery-On-aClick', items: itemChunks,successMsg: successMsg, noMessages: !successMsg});
  
});


// create items


router.post("/",  isLoggedIn, isAdmin, async (req,res,next)=>{
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

//delete items



//update items

router.put("/:id", isLoggedIn, isAdmin, async(req,res,next) => {
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
  }else{
      res.status(404).send("Item has not been updated"); 
  }

})

//delete item

router.delete("/:id", async (req, res, next) => {
  const itemId = req.params.id;
  try {
    const success = await itemDAO.deleteById(itemId);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});









module.exports = router;