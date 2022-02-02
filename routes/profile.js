const ProfileDAO = require("../data/profile-dao").ProfileDAO;
const ESAPI = require("node-esapi");
const { environmentalScripts } = require("../config/config");
const ForgotPasswordModel =
  require("../data/forgot-password-model").ForgotPasswordModel;
const UserModel = require("../data/user-model").UserModel;

const md5 = require("md5");
/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler(db) {
  "use strict";

  const profile = new ProfileDAO(db);
  const fpassword = new ForgotPasswordModel(db);
  const userModel = new UserModel(db);

  this.displayProfile = (req, res, next) => {
    const { userId } = req.session;

    profile.getByUserId(parseInt(userId), (err, doc) => {
      if (err) return next(err);
      doc.userId = userId;

      // @TODO @FIXME
      // while the developer intentions were correct in encoding the user supplied input so it
      // doesn't end up as an XSS attack, the context is incorrect as it is encoding the firstname for HTML
      // while this same variable is also used in the context of a URL link element
      doc.website = ESAPI.encoder().encodeForHTML(doc.website);
      // fix it by replacing the above with another template variable that is used for
      // the context of a URL in a link header
      // doc.website = ESAPI.encoder().encodeForURL(doc.website)

      return res.render("profile", {
        ...doc,
        environmentalScripts,
      });
    });
  };

  this.displayUserProfile = (req, res, next) => {
    const { userId } = req.session;

    profile.getByUserId(parseInt(userId), (err, doc) => {
      if (err) return next(err);
      doc.userId = userId;

      // @TODO @FIXME
      // while the developer intentions were correct in encoding the user supplied input so it
      // doesn't end up as an XSS attack, the context is incorrect as it is encoding the firstname for HTML
      // while this same variable is also used in the context of a URL link element
      doc.website = ESAPI.encoder().encodeForHTML(doc.website);
      // fix it by replacing the above with another template variable that is used for
      // the context of a URL in a link header
      // doc.website = ESAPI.encoder().encodeForURL(doc.website)
      const firstNameSafeString = doc.firstName;
      console.log("doc", doc);
      return res.render("user-profile", {
        ...doc,
        firstNameSafeString,
        environmentalScripts,
        headerClass: "cls",
      });
    });
  };

  this.handleProfileUpdate = (req, res, next) => {
    const { firstName, lastName, ssn, dob, address, bankAcc, bankRouting } =
      req.body;

    // Fix for Section: ReDoS attack
    // The following regexPattern that is used to validate the bankRouting number is insecure and vulnerable to
    // catastrophic backtracking which means that specific type of input may cause it to consume all CPU resources
    // with an exponential time until it completes
    // --
    // The Fix: Instead of using greedy quantifiers the same regex will work if we omit the second quantifier +
    // const regexPattern = /([0-9]+)\#/;
    const regexPattern = /([0-9]+)+\#/;
    // Allow only numbers with a suffix of the letter #, for example: 'XXXXXX#'
    const testComplyWithRequirements = regexPattern.test(bankRouting);
    // if the regex test fails we do not allow saving
    if (testComplyWithRequirements !== true) {
      const firstNameSafeString = firstName;
      return res.render("profile", {
        updateError:
          "Bank Routing number does not comply with requirements for format specified",
        firstNameSafeString,
        lastName,
        ssn,
        dob,
        address,
        bankAcc,
        bankRouting,
        environmentalScripts,
      });
    }

    const { userId } = req.session;

    profile.updateUser(
      parseInt(userId),
      firstName,
      lastName,
      ssn,
      dob,
      address,
      bankAcc,
      bankRouting,
      (err, user) => {
        if (err) return next(err);

        // WARN: Applying any sting specific methods here w/o checking type of inputs could lead to DoS by HPP
        //firstName = firstName.trim();
        user.updateSuccess = true;
        user.userId = userId;

        return res.render("profile", {
          ...user,
          environmentalScripts,
        });
      }
    );
  };
  this.handleProfileUpdateUser = (req, res, next) => {
    const { firstName, lastName, ssn, dob, address, bankAcc, bankRouting } =
      req.body;

    // Fix for Section: ReDoS attack
    // The following regexPattern that is used to validate the bankRouting number is insecure and vulnerable to
    // catastrophic backtracking which means that specific type of input may cause it to consume all CPU resources
    // with an exponential time until it completes
    // --
    // The Fix: Instead of using greedy quantifiers the same regex will work if we omit the second quantifier +
    // const regexPattern = /([0-9]+)\#/;
    const regexPattern = /([0-9]+)+\#/;
    // Allow only numbers with a suffix of the letter #, for example: 'XXXXXX#'
    const testComplyWithRequirements = regexPattern.test(bankRouting);
    // if the regex test fails we do not allow saving
    if (testComplyWithRequirements !== true) {
      const firstNameSafeString = firstName;
      return res.render("user-profile", {
        updateError:
          "Bank Routing number does not comply with requirements for format specified",
        firstNameSafeString,
        lastName,
        ssn,
        dob,
        address,
        bankAcc,
        bankRouting,
        environmentalScripts,
      });
    }

    const { userId } = req.session;

    profile.updateUser(
      parseInt(userId),
      firstName,
      lastName,
      ssn,
      dob,
      address,
      bankAcc,
      bankRouting,
      (err, user) => {
        if (err) return next(err);

        // WARN: Applying any sting specific methods here w/o checking type of inputs could lead to DoS by HPP
        //firstName = firstName.trim();
        user.updateSuccess = true;
        user.userId = userId;

        return res.render("user-profile", {
          ...user,
          environmentalScripts,
        });
      }
    );
  };
  this.forgotPasswordPage = (req, res, next) => {
    return res.render("forgot-password", {
      headerClass: "cls",
      loginError: "fpage",
    });
  };
  this.forgotPasswordHandle = (req, res, next) => {
    const { username } = req.body;
    console.log("uname", username);

    if (!username) {
      return res.render("forgot-password", {
        headerClass: "cls",
        loginError: "Username is required",
      });
    }

    const user_ = userModel.getUserByUserName(username, (err, user) => {
      try {
        const { _id: userId } = user;
        const token = md5(username);
        fpassword.addToken(userId, token, (err, user) => {
          if (err) return next(err);
          return res.render("forgot-password", {
            headerClass: "cls",
            success: "We have sent a forgot password link on your email",
          });
        });
      } catch (error) {
        return res.render("forgot-password", {
          headerClass: "cls",
          loginError: "User not found",
        });
      }
    });
  };
  this.changePasswordPage = (req, res, next) => {
    if (!req.query.token) {
      return res.redirect("/forgot-password#token is required");
    }
    const { token } = req.query;
    console.log("toke", token);
    fpassword.getUserByToken(token, (err, user) => {
      console.log("user", user);
      if (err) return next(err);
      if (!user) return res.redirect("/forgot-password#invalid token");
      return res.render("change-password", {
        environmentalScripts,
        headerClass: "cls",
        userId: user.userId,
      });
    });
    // return res.render("change-password", {
    //   environmentalScripts,
    //   headerClass: "cls",
    // });
  };

  this.handleChangePassword = (req, res, next) => {
    const { password, confirm_password, userId } = req.body;
    // return res.json(req.body);
    if (password !== confirm_password) {
      return res.render("change-password", {
        updateError: "new password doesn't match.",
        userId,
      });
    }

    profile.updatePassword(parseInt(userId), password, (err, user) => {
      if (err) return next(err);

      user.updateSuccess = true;
      user.userId = userId;
      console.log("success");
      return res.redirect("/login");
    });
  };
}

module.exports = ProfileHandler;
