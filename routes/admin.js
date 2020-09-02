
const { Router } = require("express");
const router = Router();

const itemDAO = require('../daos/items');
const orderDAO = require('../daos/order')
const middleware = require('./middleware');

// get admin area

router.get("/", async(req,res,next) => {

    res.render('admin-layout/admin')
})
  

//ITEMS

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



//update items
router.get("/items/update/:id",middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    console.log("Inside get item update")
    const itemId =  req.params.id;

    res.render('admin-layout/item_update', {_id: itemId});
})

router.post("/items/update/:id", middleware.isLoggedIn, middleware.isAdmin, async(req,res,next) => {

  const itemId = req.params.id;
  const itemTitle = req.body.title;


  const updatedItem = await itemDAO.updateItem(itemId, itemTitle);

      successMsg = req.flash('success', 'Item updated');
      res.redirect('/admin/items');
  

  });





//create items for admin

router.get("/items/add", middleware.isLoggedIn, async(req,res,next)=>{
    res.render('admin-layout/item_create');
})

router.post("/items/add",  middleware.isLoggedIn, middleware.isAdmin, async (req,res,next)=>{
    const imagePath = req.body.imagePath;
    const title = req.body.title;
    const description = req.body.description;
    const story = req.body.story;
    const size = req.body.size;
    const price = req.body.price;

    const newItem = await itemDAO.create(imagePath,title, description, story, size, price );
    console.log(newItem)
    if(newItem){
        newItem.save();
        req.flash('success', 'Item Created');
        res.redirect('/admin/items');
        } else{
          res.status(409).send("Item already exists");
        }
    
});

//delete an item

router.get("/items/:id", middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    const itemId = req.params.id;
    const success = await itemDAO.deleteById(itemId);
    console.log(success)
    req.flash('success', 'Item has been successfully deleted!');
    res.redirect('/admin/items');
    

});

//get all orders for admin 

router.get("/orders", middleware.isLoggedIn, async(req,res,next)=>{

    if(req.user.roles.includes('admin')){
        
        orders = await orderDAO.getAll();
        console.log(orders);
        res.render('admin-layout/orders', {orders: orders,successMsg: successMsg, noMessages: !successMsg})
    }
    else{
        errorMsg = req.flash('error', 'Not Authorized!');
        res.redirect('/');
    }
});

//update items
router.get("/orders/update/:id",middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    console.log("Inside get order update")
    const orderId =  req.params.id;

    res.render('admin-layout/orders_update', {_id: orderId});
})

router.post("/orders/update/:id", middleware.isLoggedIn, middleware.isAdmin, async(req,res,next) => {

  const orderId = req.params.id;
  const orderStatus = req.body.status;


  const updatedOrder = await orderDAO.updateOrder(orderId, orderStatus);
    console.log(updatedOrder)

      successMsg = req.flash('success', 'Order status has been updated');
      res.redirect('/admin/orders');
  
  });


module.exports = router;
