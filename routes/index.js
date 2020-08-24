const { Router } = require("express");
const router = Router();


router.use("/user", require("./user"));

router.use("/", require("./item"));

router.use("/about", function(req,res,next){
    res.render('shop/about')
})

router.use("/contact", function(req,res,next){
    res.render('shop/contact')
})

router.use("/add-to-cart/:id", function(req,res,next){
    const productId = req.params.id;
})



module.exports = router;