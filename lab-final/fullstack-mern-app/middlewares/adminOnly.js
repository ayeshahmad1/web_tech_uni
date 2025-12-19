module.exports = function adminOnly(req, res, next) {
  const user = req.session.user;

  if (!user || user.email !== "admin@shop.com") {
    return res.status(403).send("Access Denied: Admins Only");
  }

  next();
};
