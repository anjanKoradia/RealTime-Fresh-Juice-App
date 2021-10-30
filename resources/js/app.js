import initAdmin from "./admin/admin";
import deleteJuice from "./admin/deleteJuice";
import addToCart from "./cart/addItem";
import manageItemQty from "./cart/itemQty";
import addJuice from "./admin/addjuice";
import placeOrder from "./cart/placeOrder";

const socket = io();
const alertMsg = document.querySelectorAll(".alert");

// Alert message timeout
alertMsg.forEach((msg) => {
  if (msg) {
    setTimeout(() => {
      msg.remove();
    }, 2000);
  }
});

/* ---------------------------------------- 
  Cart
---------------------------------------- */
addToCart(socket);
manageItemQty();
placeOrder();

/* ---------------------------------------- 
  Admin
---------------------------------------- */
initAdmin(socket);
addJuice();
deleteJuice();
