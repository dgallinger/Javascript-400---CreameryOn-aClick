const { Router } = require("express");
const router = Router();

//rendering the about page
router.get("/", async(req,res,next)=> {
        res.render('layouts/about')
    })


module.exports = router;