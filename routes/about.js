const { Router } = require("express");
const router = Router();


router.get("/", async(req,res,next)=> {
        res.render('layouts/about')
    })


module.exports = router;