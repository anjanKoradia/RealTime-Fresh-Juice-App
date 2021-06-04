const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    items: { type: Object, require: true },
    phone_number: { type: String, require: true },
    address: { type: String, default: "customer" },
    payment_type: { type: String, default: "Cash On Delivery" },
    status: { type: String, default: "Order Placed" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
