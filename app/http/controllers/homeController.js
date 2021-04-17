const Menu = require("../../models/menu");

function homeController() {
  return {
    index: async (req, res) => {
      const juices = await Menu.find();
      console.log(juices);
      return res.render("home", { juices: juices });
    },
  };
}

module.exports = homeController;
