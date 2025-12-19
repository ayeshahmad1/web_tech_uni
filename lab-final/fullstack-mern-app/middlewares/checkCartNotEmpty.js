module.exports = function checkCartNotEmpty(req, res, next) {
  const cart = req.cookies.cart;

  if (!cart || cart.length === 0) {
    req.flash("danger", "Your cart is empty. Please add items before checkout.");
    return res.redirect("/cart");
  }

  next();
};
