var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const checkCartNotEmpty = require("../middlewares/checkCartNotEmpty");

router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let products = await Product.find({ _id: { $in: cart } });

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render("site/cart", { products, total });
});

router.get("/checkout", checkCartNotEmpty, async function (req, res, next) {
  let cart = req.cookies.cart;
  let products = await Product.find({ _id: { $in: cart } });
  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render("site/checkout", { products, total });
});
router.post("/checkout", checkCartNotEmpty, async function (req, res, next) {
  try {
    const { customerName, email } = req.body;
    let cart = req.cookies.cart;

    let products = await Product.find({ _id: { $in: cart } });
    
    const cartItems = products.map(product => ({
      product: product.name,
      quantity: 1,
      price: Number(product.price)
    }));

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const order = new Order({
      customerName,
      email,
      cartItems,
      totalAmount,
      orderStatus: "Pending"
    });

    const savedOrder = await order.save();

    // Clear cart cookie
    res.clearCookie("cart");

    req.flash("success", "Order placed successfully!");
    res.redirect(`/order-confirmation/${savedOrder._id}`);
  } catch (err) {
    console.error("Error creating order:", err);
    req.flash("danger", "Error creating order");
    res.redirect("/checkout");
  }
});

router.get("/order-confirmation/:orderId", async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.render("site/order-confirmation", { order });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).send("Error fetching order");
  }
});

router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  req.flash("success", "Product Added To Cart");
  res.redirect("/");
});

router.get("/:page?", async function (req, res, next) {
  let page = Number(req.params.page);
  let pageSize = 10;
  let skip = (page - 1) * pageSize;
  if (!page) page = 1;
  if (!skip) skip = 0;

  // return res.send({ page, pageSize, skip });
  let products = await Product.find().skip(skip).limit(pageSize);
  let totalProducts = await Product.countDocuments();
  let totalPages = Math.ceil(totalProducts / pageSize);
  return res.render("site/homepage", {
    pagetitle: "Awesome Products",
    products,
    page,
    pageSize,
    totalPages,
  });
});

router.get("/:Catagorys?", async function (req, res, next) {
  let catagories = await Category.find();
  
  return res.render("site/collections/Catetorys", {
    Category_title: "All Catagories",
    catagories,
  });
});

module.exports = router;
