const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });

        // Check if email is exist or not
        if (!user) {
          return done(null, false, { message: "No user with this email." });
        }

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Loged in succesfully" });
            } else {
              return done(null, false, {
                message: "Wrong user name or password.",
              });
            }
          })
          .catch((error) => {
            return done(null, false, { message: "Somthing went worng." });
          });
      }
    )
  );

  //   If user succesfully loged in then this process store user id in sessiond
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // we get user id from session which we have store in session using above method
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
}

module.exports = init;
