/* The ProfileDAO must be constructed with a connected database object */
function ProfileDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === this instanceof ProfileDAO) {
    console.log(
      "Warning: ProfileDAO constructor called without 'new' operator"
    );
    return new ProfileDAO(db);
  }

  const users = db.collection("users");

  this.updateUser = (
    userId,
    firstName,
    lastName,
    ssn,
    dob,
    address,
    bankAcc,
    bankRouting,
    callback
  ) => {
    // Create user document
    const user = {};
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (address) {
      user.address = address;
    }
    if (bankAcc) {
      user.bankAcc = bankAcc;
    }
    if (bankRouting) {
      user.bankRouting = bankRouting;
    }
    if (ssn) {
      user.ssn = ssn;
    }
    if (dob) {
      user.dob = dob;
    }
    /*
        // Fix for A7 - Sensitive Data Exposure
        // Store encrypted ssn and DOB
        if(ssn) {
            user.ssn = encrypt(ssn);
        }
        if(dob) {
            user.dob = encrypt(dob);
        }
        */

    users.update(
      {
        _id: parseInt(userId),
      },
      {
        $set: user,
      },
      (err) => {
        if (!err) {
          console.log("Updated user profile");
          return callback(null, user);
        }

        return callback(err, null);
      }
    );
  };

  this.getByUserId = (userId, callback) => {
    users.findOne(
      {
        _id: parseInt(userId),
      },
      (err, user) => {
        if (err) return callback(err, null);
        /*
                // Fix for A6 - Sensitive Data Exposure
                // Decrypt ssn and DOB values to display to user
                user.ssn = user.ssn ? decrypt(user.ssn) : "";
                user.dob = user.dob ? decrypt(user.dob) : "";
                */

        callback(null, user);
      }
    );
  };
  this.updatePassword = (userId, password, callback) => {
    users.update(
      {
        _id: parseInt(userId),
      },
      {
        $set: { password },
      },
      (err) => {
        if (!err) {
          console.log("Updated user passsword");
          return callback(null, { userId });
        }

        return callback(err, null);
      }
    );
  };
}

module.exports = { ProfileDAO };
