const { Router }= require('express');
const router = Router();

// Get home page
router.get("/", function(req,res,next) {
  res.render('shop/index', {title: 'CreameryOn-AClick'})
});



module.exports = router;