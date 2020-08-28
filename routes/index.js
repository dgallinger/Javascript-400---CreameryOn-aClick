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






module.exports = router;