const Menu = require("../../../models/menu");

function itemController() {
  return {
    index: async (req, res) => {
      const menu = await Menu.findById(req.params.id);
      if (menu) {
        return res.render("admin/editItem", { menu: menu });
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

      return res.redirect("/");
    },
  };
}

module.exports = itemController;
