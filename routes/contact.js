const { Router } = require("express");
const router = Router();


// rednering contacts page

router.get("/", async (req,res,next) => {
    res.render('layouts/contact')
})


module.exports = router;