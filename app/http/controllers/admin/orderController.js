const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    index: async (req, res) => {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customer_id", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        });
    },

    updateStatus: (req, res) => {
      Order.updateOne(
        { _id: req.body.orderId },
        { status: req.body.status },
        (error, data) => {
          if (error) {
            return res.redirect("/admin/orders");
          }
          return res.redirect("/admin/orders");
        }
      );
    },
  };
}

module.exports = orderController;
