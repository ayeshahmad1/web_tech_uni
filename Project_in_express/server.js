const express = require("express");
const mongoose = require("mongoose");
const app = express();
var expressLayouts = require("express-ejs-layouts");

const PORT = 3000;


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(expressLayouts);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/ourcompany", (req, res) => {
  res.render("ourcompany");
});

app.get("/beglasses", (req, res) => {
  res.render("beglasses");
});

app.get("/brands", (req, res) => {
  res.render("brands");
});

app.get("/buy-now", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 2;

  const response = await fetch("http://localhost:4000/api/public/products");
  const allProducts = await response.json();

  const totalPages = Math.ceil(allProducts.length / limit);
  const start = (page - 1) * limit;
  const products = allProducts.slice(start, start + limit);

  res.render("buynow", {
    pagetitle: "Buy Now",
    products,
    page,
    totalPages
  });
});



app.get("/admin", (req, res) => {
  res.redirect("http://localhost:4000/admin")
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});