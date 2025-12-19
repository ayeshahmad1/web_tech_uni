const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

// GET - Display all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdDate: -1 });
    res.render("admin/orders/list", { 
      orders,
      title: "Orders Management",
      layout: "admin-layout"
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    req.flash("danger", "Error fetching orders");
    res.redirect("/");
  }
});

// POST - Mark order as Confirmed
router.post("/:id/confirm", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: "Confirmed" },
      { new: true }
    );

    if (!order) {
      req.flash("danger", "Order not found");
      return res.redirect("/admin/orders");
    }

    req.flash("success", `Order ${order._id} marked as Confirmed`);
    res.redirect("/admin/orders");
  } catch (err) {
    console.error("Error confirming order:", err);
    req.flash("danger", "Error confirming order");
    res.redirect("/admin/orders");
  }
});

// POST - Cancel order
router.post("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: "Cancelled" },
      { new: true }
    );

    if (!order) {
      req.flash("danger", "Order not found");
      return res.redirect("/admin/orders");
    }

    req.flash("success", `Order ${order._id} has been Cancelled`);
    res.redirect("/admin/orders");
  } catch (err) {
    console.error("Error cancelling order:", err);
    req.flash("danger", "Error cancelling order");
    res.redirect("/admin/orders");
  }
});

module.exports = router;
