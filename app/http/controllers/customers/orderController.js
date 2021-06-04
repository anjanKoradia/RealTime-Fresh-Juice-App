const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    index: async (req, res) => {
      const orders = await Order.find({ customer_id: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.render("customers/orders", { orders: orders, moment: moment });
    },

    store: (req, res) => {
      // Validate request
      const { phone_number, address } = req.body;
      if (!phone_number || !address) {
        req.flash("error", "All fields are required.");
        return res.redirect("/cart");
      }

      const order = new Order({
        customer_id: req.user._id,
        items: req.session.cart.items,
        phone_number: phone_number,
        address: address,
      });

      // save order in database
      order
        .save()
        .then((order) => {
          req.flash("success", "Order placed successfully.");
          delete req.session.cart;
          return res.redirect("/customer/orders");
        })
        .catch((error) => {
          req.flash("erroe", "Somthing went wrong");
          return res.redirect("/cart");
        });
    },
  };
}

module.exports = orderController;
