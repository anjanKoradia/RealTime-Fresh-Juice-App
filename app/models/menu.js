const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema(
  {
    name: { type: String, require: true },
    image: {
      type: String,
      require: true,
      get: (image) => {
        // http://localhost:5000/uploads/1616443169266-52350494.png
        return `${process.env.APP_URL}/${image}`;
      },
    },
    quantity: { type: String, require: true },
    price: { type: Number, require: true },
  },
  { toJSON: { getters: true }, id: false }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
