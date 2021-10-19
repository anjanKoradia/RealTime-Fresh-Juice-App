const fs = require("fs");
const Menu = require("../../../models/menu");

function deleteJuiceController() {
  return {
    deleteJuice: async (req, res, next) => {
      let juice;

      try {
        juice = await Menu.findOneAndRemove({ _id: req.params.id });
      } catch (error) {
        return next("some error from db");
      }

      const filePath = juice._doc.image;

      fs.unlink(`${appRoot}/public/${filePath}`, (err) => {
        if (err) {
          return next("Some Error");
        }
      });

      return res.json(juice);
    },
  };
}

module.exports = deleteJuiceController;
