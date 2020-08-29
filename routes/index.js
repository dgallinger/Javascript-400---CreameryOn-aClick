const { Router } = require("express");
const router = Router();




router.use("/user", require("./user"));
router.use("/order", require("./order"));
router.use("/about", require("./about"));
router.use("/contact", require("./contact"));
router.use("/shopping-cart", require("./shopping-cart"));
router.use("/checkout", require("./checkout"));
router.use("/change-password",require("./change-password"));
router.use("/reduce", require("./reduce"));
router.use("/remove", require("./remove"));
router.use("/admin", require("./admin"));


router.use("/", require("./item"));


/*
 * Middleware for error handling
 */
router.use(async (err, req, res, next) => {
  if (err.message.includes("Cast to ObjectId failed")) //db: invalid ObjectId
  {    
    res.status(400).send('Invalid id provided.');
  }
  else if (err.message.includes("E11000 duplicate key error")) //db: unique index error
  {
    res.sendStatus(409);
  } 
  else if (err.message.includes('jwt malformed')) //jwt: invalid token
  {
    res.sendStatus(401);
  }
  else 
  {
    console.log(err);
    res.status(500).send('An unexpected error occurred.')  
  } 
});




module.exports = router;