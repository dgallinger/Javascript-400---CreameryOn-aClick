
const { Router } = require("express");
const router = Router();

const itemDAO = require('../daos/items');
const orderDAO = require('../daos/order')
const middleware = require('./middleware');

// const isAdmin = async(req,res,next) => {
//   if(req.user.roles.includes('admin')) {
//       next();
//   }
//   else{
//       res.sendStatus(403);
//   }

// };

// const isLoggedIn = async(req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     req.session.oldUrl = req.url;
//     res.redirect('/user/signin');
//   }


router.get("/", async(req,res,next) => {

    res.render('admin-layout/admin')
})
  



//get all items for admin
router.get("/items", middleware.isLoggedIn, async(req,res,next)=>{
    

    if(req.user.roles.includes('admin')){
        let successMsg = req.flash('success')[0];
        let itemChunks = [];
        await itemDAO.getAll(itemChunks);
        res.render('admin-layout/items', {items: itemChunks,successMsg: successMsg, noMessages: !successMsg})

    }
    else{
    req.flash('error', 'Not Authorized!');
    res.redirect('/');
    }
})

//update items for admin
router.get("/items/update", middleware.isLoggedIn, async(req,res,next)=>{
    res.render('admin-layout/item_update');
})

//create items for admin

router.get("/items/add", middleware.isLoggedIn, async(req,res,next)=>{
    res.render('admin-layout/item_create');
})

router.post("/items/add",  middleware.isLoggedIn, middleware.isAdmin, async (req,res,next)=>{
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const story = req.body.story
    const size = req.body.size;
    const imagePath = req.body.imagePath;
  
    console.log(title);
    console.log(price);
    console.log(description);
    console.log(story);
    console.log(size);
    console.log(imagePath);
  
    const newItem = await itemDAO.create(imagePath,title, description, story, size, price );
    if(newItem){
        newItem.save();
        req.flash('success', 'Item Created');
        res.redirect('/admin/items');
        } else{
          res.status(409).send("Item already exists");
        }
    
  });

  //delete an item

  router.get("/items/:id", async (req, res, next) => {
    const itemId = req.params.id;
    const success = await itemDAO.deleteById(itemId);
    console.log(success)
    req.flash('success', 'Item has been successfully deleted!');
    res.redirect('/admin/items');
    

  });





//get all orders for admin pending rendering

router.get("/orders", middleware.isLoggedIn, async(req,res,next)=>{

    if(req.user.roles.includes('admin')){
        let successMsg = req.flash('success')[0];
        orders = await orderDAO.getAll();
        console.log(orders);
        res.render('admin-layout/orders', {orders: orders,successMsg: successMsg, noMessages: !successMsg})
    }
    else{
        errorMsg = req.flash('error', 'Not Authorized!');
        res.redirect('/');
    }
})


module.exports = router;
