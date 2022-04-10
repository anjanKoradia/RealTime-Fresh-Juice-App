const Menu = require("../../../models/menu");

function editJuiceController() {
  return {
    index: async (req, res) => {
      const menu = await Menu.findById(req.params.id);
      if (menu) {
        return res.render("admin/editJuice", { menu: menu });
      }

      return res.redirect("/");
    },

    updateDetails: async (req, res) => {
      const { juice_name, quantity, price } = req.body;

      let result = await Menu.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: juice_name,
            quantity: quantity,
            price: price,
          },
        },
        { returnOriginal: false }
      );  

      req.flash("success", "Details update successfully.");

      return res.redirect(`/admin/menu/editJuice/${req.params.id}`);
    },
  };
}

module.exports = editJuiceController;
