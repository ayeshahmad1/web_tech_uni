const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const checkCartNotEmpty = require("../middlewares/checkCartNotEmpty");

router.get("/checkout", checkCartNotEmpty, (req, res) => {
  const cart = req.session.cart;
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.render("checkout", { cart, total });
});

router.post("/checkout", checkCartNotEmpty, async (req, res) => {
  const { customerName, email } = req.body;
  const cart = req.session.cart;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = new Order({
    customerName,
    email,
    items: cart.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    totalAmount
  });

  const savedOrder = await order.save();

  req.session.cart = [];

  res.redirect(`/order-confirmation/${savedOrder._id}`);
});

module.exports = router;
