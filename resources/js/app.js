import moment from "moment";
import initAdmin from "./admin";
import {
  addToCart,
  decreaseItemQty,
  increaseItemQty,
  removeItem,
} from "./cart";

/* ---------------------------------------- 
Cart Functionality 
---------------------------------------- */
addToCart();
increaseItemQty();
decreaseItemQty();
removeItem();

/* ---------------------------------------- 
Socket 
---------------------------------------- */
const socket = io();

// Join
if (order) {
  socket.emit("join", `order_${order._id}`);
}

// Update order list in real time
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

// Update order status in real time
socket.on("statusUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
});

// Display admin orders
initAdmin(socket);
