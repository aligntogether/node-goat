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
    const file = req.file;
    const data = fs.readFileSync(file.path, {
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
    // let product = products.get("//product");
    let prod = products.find("//product");
    // [1].childNodes()[1].text()
    prod.forEach((each) => {
      data.push({
        title: each.childNodes()[0].text(),
        price: each.childNodes()[1].text(),
      });
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
