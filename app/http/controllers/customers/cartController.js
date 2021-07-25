function cartController() {
  return {
    index: (req, res) => {
      res.render("customers/cart");
    },

    update: (req, res) => {
      // Structure
      // let cart = {
      //   items: {
      //     pizzaId: {
      //       item: pizzaObject,
      //       qty: 0,
      //     },
      //     totalQty: 0,
      //     totalPrice: 0,
      //   },
      // };

      // For the first time creating cart and adding basic object structure
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      let cart = req.session.cart;

      // Check if item dose not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }

      return res.json({ totalQty: req.session.cart.totalQty });
    },

    removeItem: (req, res) => {
      const { id } = req.params;
      let cart = req.session.cart;

      cart.totalQty -= cart.items[id].qty;
      cart.totalPrice -= cart.items[id].qty * cart.items[id].item.price;

      delete cart.items[id];

      return res.json({ cart: req.session.cart });
    },

    increaseItemQty: (req, res) => {
      const { id } = req.params;
      let cart = req.session.cart;

      cart.items[id].qty++;
      cart.totalPrice += cart.items[id].item.price;
      cart.totalQty++;

      return res.json({
        cart: req.session.cart,
      });
    },

    decreaseItemQty: (req, res) => {
      const { id } = req.params;
      let cart = req.session.cart;

      if (cart.items[id].qty > 1) {
        cart.items[id].qty--;
        cart.totalPrice -= cart.items[id].item.price;
        cart.totalQty--;
      }

      return res.json({
        cart: req.session.cart,
      });
    },
  };
}

module.exports = cartController;
