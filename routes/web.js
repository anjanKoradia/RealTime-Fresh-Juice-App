const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const customerOrderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const adminItemController = require("../app/http/controllers/admin/itemController");

// Middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");
const cart = require("../app/http/middlewares/cart");
const menuController = require("../app/http/controllers/menu/menuController");

function initRoutes(app) {
  app.get("/", homeController().index);

  // Menu Routes
  app.get("/menu/addJuice", menuController().indexAddJuice);
  app.post("/menu/addJuice", menuController().addJuice);
  app.get("/menu/editJuice/:id", menuController().indexUpdateDetails);
  app.post("/menu/editJuice/:id/update", menuController().updateDetails);

  // Cart Routes
  app.get("/cart", cart, cartController().index);
  app.post("/update-cart", cartController().update);
  app.put("/cart/increase-qty/:id", cartController().increaseItemQty);
  app.put("/cart/decrease-qty/:id", cartController().decreaseItemQty);
  app.delete("/cart/remove-item/:id", cartController().removeItem);

  // Login Routes
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  // Register Route
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  app.post("/logout", authController().logout);

  // Customer Routes
  app.post("/orders", auth, customerOrderController().store);
  app.get("/customer/orders", auth, customerOrderController().index);
  app.get("/customer/order/:id", auth, customerOrderController().showStauts);

  // Admin Routes
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, adminOrderController().updateStatus);
}

module.exports = initRoutes;
