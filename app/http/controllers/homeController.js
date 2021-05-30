const Menu = require("../../models/menu");

function homeController() {
  return {
    index: async (req, res) => {
      // find() method is use to retrive all data from database
      const juices = await Menu.find();
      return res.render("home", { juices: juices });
    },
  };
}

module.exports = homeController;
