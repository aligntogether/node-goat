/* The ForgotPasswordModel must be constructed with a connected database object */
function ForgotPasswordModel(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === this instanceof ForgotPasswordModel) {
    console.log(
      "Warning: ForgotPasswordModel constructor called without 'new' operator"
    );
    return new ForgotPasswordModel(db);
  }

  const forgotPassword = db.collection("forgot-password");

  this.addToken = (userId, token, callback) => {
    forgotPassword.insert({ userId, token }, (err, result) =>
      !err ? callback(null, result.ops[0]) : callback(err, null)
    );
  };

  this.getUserByToken = (token, callback) => {
    forgotPassword.findOne(
      {
        token: token,
      },
      callback
    );
  };
  this.all = (callback) => {
    forgotPassword
      .find({})
      .sort({
        timestamp: -1,
      })
      .toArray((err, data) => {
        if (err) return callback(err, null);
        if (!data) return callback("ERROR: No data found", null);
        callback(null, data);
      });
  };
}

module.exports = { ForgotPasswordModel };
