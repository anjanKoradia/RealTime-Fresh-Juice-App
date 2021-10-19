const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const customerOrderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const addJuiceController = require("../app/http/controllers/admin/addJuiceController");
const editJuiceController = require("../app/http/controllers/admin/editJuiceController");
const deleteJuiceController = require("../app/http/controllers/admin/deleteJuiceController");

// Middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");
const cart = require("../app/http/middlewares/cart");

function initRoutes(app) {
  app.get("/", homeController().index);

  // Menu Routes
  app.get("/admin/menu/addJuice", addJuiceController().index);
  app.post("/admin/menu/addJuice", addJuiceController().addJuice);
  app.get("/admin/menu/editJuice/:id", editJuiceController().index);
  app.post(
    "/admin/menu/editJuice/:id/update",
    editJuiceController().updateDetails
  );
  app.delete(
    "/admin/menu/editJuice/:id/delete",
    deleteJuiceController().deleteJuice
  );

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
