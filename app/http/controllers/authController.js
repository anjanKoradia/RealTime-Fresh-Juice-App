const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  return {
    login: (req, res) => {
      res.render("auth/login");
    },

    postLogin: (req, res, next) => {
      // Validation for any empty fileld
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash("error", "All field are required.");
        return res.redirect("/login");
      }

      passport.authenticate("local", (error, user, info) => {
        if (error) {
          req.flash("error", info.message);
          return next(error);
        }

        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (error) => {
          if (error) {
            req.flash("error", info.message);
            return next(error);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    },

    register: (req, res) => {
      res.render("auth/register");
    },

    postRegister: async (req, res) => {
      const { name, email, password } = req.body;

      // Validation for any empty fileld
      if (!name || !email || !password) {
        req.flash("error", "All field are required.");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // check if email is alredy exists in database
      User.exists({ email: email }, (error, result) => {
        if (result) {
          req.flash("error", "Email is already taken.");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      // Encode password (Hase Password)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      // save user in database
      user
        .save()
        .then((user) => {
          return res.redirect("/login");
        })
        .catch((error) => {
          req.flash("error", "Somthing went wrong.");
          return res.redirect("/register");
        });
    },

    logout: (req, res) => {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
