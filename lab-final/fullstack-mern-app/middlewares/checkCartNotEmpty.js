module.exports = function checkCartNotEmpty(req, res, next) {
  const cart = req.session.cart;

  if (!cart || cart.length === 0) {
    return res.redirect("/cart");
  }

  next();
};
