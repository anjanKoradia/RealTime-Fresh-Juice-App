const Order = require("../../../models/order");
const moment = require("moment");
const Razorpay = require("razorpay")

const razorPay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

let order = new Order();

function orderController() {
  return {
    index: async (req, res) => {
      const orders = await Order.find({ customer_id: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      res.render("customers/orders", { orders: orders, moment: moment });
    },

    razorpay: (req, res) => {
      // Validate request
      const { phone_number, address } = req.body;
      if (!phone_number || !address) {
        return res.json({ "status": "error", "message": "All fields are required." });
      }

      order = new Order({
        customer_id: req.user._id,
        items: req.session.cart.items,
        phone_number: phone_number,
        address: address,
      });

      // Razorpay config
      const options = {
        amount: req.session.cart.totalPrice * 100,
        currency: "INR",
        receipt: `Juice_Order_${order._id}`,
        notes: {
          customer_name: req.user.name,
          customer_email: req.user.email,
          customer_number: phone_number,
        },
      }
      razorPay.orders.create(options, (err, order) => {
        return res.json(order);
      })
    },

    store: (req, res) => {
      // check payment is done or not
      razorPay.payments.fetch(req.body.razorpay_payment_id).then((payment) => {
        if (payment.status === "captured") {
          // save order in database
          order
            .save()
            .then((order) => {
              Order.populate(order, { path: "customer_id" }, (error, result) => {
                result.paymetn_id = payment.id;
                result.payment_type = payment.method;
                result.payment_status = true;

                result.save().then((ord) => {
                  delete req.session.cart;

                  // Emit event (this is for update order list realtime in admin panel)
                  const eventEmitter = req.app.get("eventEmitter");
                  eventEmitter.emit("orderPalced", ord);

                  return res.json({ "status": "success", "message": "Order placed successfully." });
                })
              });
            })
            .catch((error) => {
              return res.json({ "status": "error", "message": "Somthing went wrong." });
            });
        }
      })
    },

    showStauts: async (req, res) => {
      const order = await Order.findById(req.params.id);

      // Authorized user (Restrict customer to see another customer order status)
      // use toString() method because we can't compare to objects
      if (req.user._id.toString() === order.customer_id.toString()) {
        return res.render("customers/orderStatus", { order: order });
      }

      return res.redirect("/");
    },
  };
}

module.exports = orderController;
