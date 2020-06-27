var express = require("express");
var router = express.Router();
router.get("/api/test/",function(req,res){
  res.send({message:"successful connection to server"})
  console.debug("s")
})
module.exports = router;