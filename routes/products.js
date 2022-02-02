// const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const { environmentalScripts } = require("../config/config");
const fs = require("fs");
function ProductsHandler(db) {
  "use strict";

  this.displayProductsPage = (req, res) => {
    return res.render("products", {});
  };
  this.handleProductsUpload = (req, res) => {
    const file = req.file;
    const data = fs.readFileSync(file.path, { encoding: "utf8", flag: "r" });
    // const XMLfile = req.files.products.data;
    const products = libxmljs.parseXmlString(data, {
      noent: true,
      noblanks: true,
    });
    let html = "";
    products
      .root()
      .childNodes()
      .forEach((product) => {
        // let newProduct = new db.Product()
        // newProduct.name = product.childNodes()[0].text()
        // newProduct.description = product.childNodes()[3].text()
        // newProduct.save()
        console.log("each", product.childNodes());
      });

    res.render("products", {
      isUploaded: true,
      html,
    });
  };
}

module.exports = ProductsHandler;
