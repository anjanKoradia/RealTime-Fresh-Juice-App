const handleMultipartData = require("../../../config/multer");
const juiceDetailsSchema = require("../../../validator/juiceDetailsValidator");
const fs = require("fs");
const Menu = require("../../../models/menu");

function menuController() {
  return {
    indexAddJuice: (req, res) => {
      res.render("menu/addJuice");
    },

    addJuice: (req, res, next) => {
      handleMultipartData(req, res, async (err) => {
        if (err) {
          return err.message;
        }

        // path of image save in folder
        let fileName;

        if (req.file) {
          fileName = req.file.filename;
        } else {
          return next(new Error(`ValidationError: "image" is required`));
        }

        // validate req body using joi library
        const { error } = juiceDetailsSchema.validate(req.body);

        // if error in validate
        if (error) {
          if (fileName) {
            fs.unlink(
              `${appRoot}/public/img/juiceImages/${fileName}`,
              (err) => {
                if (err) {
                  return next(err);
                }
              }
            );
          }

          return next(error);
        }

        const { juice_name, quantity, price } = req.body;
        let document;
        try {
          document = await Menu.create({
            name: juice_name,
            image: `img/juiceImages/${fileName}`,
            quantity,
            price,
          });
        } catch (err) {
          fs.unlink(`${appRoot}/public/img/juiceImages/${fileName}`, (err) => {
            if (err) {
              return next(err.message);
            }
          });
          return next(err);
        }

        res.status(201);
        res.redirect(`/menu/editJuice/${document._id}`);
      });
    },

    indexUpdateDetails: async (req, res) => {
      const menu = await Menu.findById(req.params.id);
      if (menu) {
        return res.render("menu/editJuice", { menu: menu });
      }

      return res.redirect("/");
    },

    updateDetails: async (req, res) => {
      const { juice_name, quantity, price } = req.body;

      await Menu.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: juice_name,
            quantity: quantity,
            price: price,
          },
        }
      );

      req.flash("success", "Details update successfully.");

      return res.redirect(`/menu/editJuice/${req.params.id}`);
    },
  };
}

module.exports = menuController;
