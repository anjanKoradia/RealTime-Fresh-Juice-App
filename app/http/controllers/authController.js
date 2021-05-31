const User = require("../../models/user");
const bcrypt = require("bcrypt");

function authController() {
  return {
    login: (req, res) => {
      res.render("auth/login");
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
          // Login

          return res.redirect("/");
        })
        .catch((error) => {
          req.flash("error", "Somthing went wrong.");
          return res.redirect("/register");
        });
    },
  };
}

module.exports = authController;
