const { Router } = require("express");
const router = Router();


router.use("/user", require("./user"));

router.use("/", require("./item"));





module.exports = router;