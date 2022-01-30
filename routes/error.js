// Error handling middleware

const { fsWriteLog } = require("../config/helpers");
const errorHandler = (err, req, res, next) => {
  "use strict";
  console.log("All", req);
  console.error(err.message);
  console.error(err.stack);

  fsWriteLog(err);
  res.status(500);
  res.render("error-template", {
    error: err,
  });
};

module.exports = { errorHandler };
