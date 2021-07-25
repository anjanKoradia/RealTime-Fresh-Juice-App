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

    increaseItemQty: (req, res) => {
      req.session.cart.items[req.body.item._id].qty++;
      req.session.cart.totalPrice += req.body.item.price;
      req.session.cart.totalQty++;

      return res.json({
        cart: req.session.cart,
      });
    },

    decreaseItemQty: (req, res) => {
      req.session.cart.items[req.body.item._id].qty--;
      req.session.cart.totalPrice -= req.body.item.price;
      req.session.cart.totalQty--;

      return res.json({
        cart: req.session.cart,
      });
    },

    removeItem: (req, res) => {
      const { id } = req.params;
      req.session.cart.totalQty -= req.session.cart.items[id].qty;
      req.session.cart.totalPrice -=
        req.session.cart.items[id].qty * req.session.cart.items[id].item.price;
      delete req.session.cart.items[id];
      return res.json({ cart: req.session.cart });
    },
  };
}

module.exports = cartController;
