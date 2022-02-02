// const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const { environmentalScripts } = require("../config/config");
const fs = require("fs");
const libxmljs = require("libxmljs");
function ProductsHandler(db) {
  "use strict";

  this.displayProductsPage = (req, res) => {
    return res.render("products", {});
  };
  this.handleProductsUpload = (req, res) => {
    const data = fs.readFileSync("/home/kali/Desktop/node-goat/products.xml", {
      encoding: "utf8",
      flag: "r",
    });
    // const XMLfile = req.files.products.data;

    const products = libxmljs.parseXmlString(data, {
      noent: true,
      noblanks: true,
    });
    let html = "";
    let data = [];
    let product = products.get("//product");
    const d_ = product.split(" ");
    data.push({
      title: d_[0],
      price: d_[1],
    });
    // console.log(product.text());
    // console.log(product);

    res.render("products", {
      isUploaded: true,
      data,
    });
  };
}

module.exports = ProductsHandler;
