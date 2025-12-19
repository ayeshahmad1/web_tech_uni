const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async function (req, res) {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Invalid Email");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid Password");
  }

  req.session.user = {
    email: user.email,
    name: user.name,
    roles: user.roles
  };

  const token = jwt.sign(
    {
      _id: user._id,
      roles: user.roles,
      name: user.name,
      email: user.email,
    },
    config.get("jwtPrivateKey")
  );

  return res.json({ token });
});

module.exports = router;