"use strict";

const express = require("express");

const bodyParser = require("body-parser");
const session = require("express-session");
// const csrf = require('csurf');
const consolidate = require("consolidate"); // Templating library adapter for Express
const swig = require("swig");
// const helmet = require("helmet");
const MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
const http = require("http");
const marked = require("marked");
const serialize = require("node-serialize");
//const nosniff = require('dont-sniff-mimetype');
const app = express(); // Web framework to handle routing requests
const routes = require("./routes");
const { port, db, cookieSecret } = require("./config/config"); // Application config properties
const cookieParser = require("cookie-parser");
const { cart } = require("./cart");
MongoClient.connect(db, (err, db) => {
  if (err) {
    console.log("Error: DB: connect");
    console.log(err);
    process.exit(1);
  }
  console.log(`Connected to the database`);

  // Express middleware to populate "req.body" so we can access POST variables
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      // Mandatory in Express v4
      extended: false,
    })
  );
  // cookie parser
  app.use(cookieParser());
  // Enable session management using express middleware
  app.use(
    session({
      secret: cookieSecret,
      // Both mandatory in Express v4
      saveUninitialized: true,
      resave: true,
    })
  );
  // app.use(function (req, res, next) {
  //   if (!req.cookies.cart) {
  //     const data = new Buffer.from(JSON.stringify(cart)).toString("base64");
  //     console.log("Data:", data);
  //     res.cookie("cart", data, {
  //       maxAge: 900000,
  //       httpOnly: true,
  //     });
  //   }
  //   next();
  // });
  // Register templating engine
  app.engine(".html", consolidate.swig);
  app.set("view engine", "html");
  app.set("views", `${__dirname}/views`);
  app.use(express.static(`${__dirname}/assets`));

  marked.setOptions({
    sanitize: true,
  });
  app.locals.marked = marked;
  swig.setDefaults({
    // Autoescape disabled
    autoescape: false,
  });
  // Application routes
  routes(app, db);

  // Template system setup

  // Insecure HTTP connection
  http.createServer(app).listen(port, () => {
    console.log(`Express http server listening on port ${port}`);
  });
});
