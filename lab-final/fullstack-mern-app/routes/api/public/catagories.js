var express = require("express");
var router = express.Router();
var Category = require("../../models/Category");

router.get("/", async function (req, res, next) {
  let catagories = await Category.find();
  res.send(catagories);
});
module.exports = router;