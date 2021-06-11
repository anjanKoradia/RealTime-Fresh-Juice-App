import axios from "axios";
import moment from "moment";
import Noty from "noty";
import initAdmin from "./admin";

let addToCartBtn = document.querySelectorAll(".add_to_cart_btn");
let cartCounter = document.querySelector(".cart_counter");

// In navbar display total orders and when it added to cart show success popup
const updateCart = (juice) => {
  axios.post("/update-cart", juice).then((res) => {
    cartCounter.innerText = res.data.totalQty;
    new Noty({
      theme: "metroui",
      type: "success",
      text: "Item added to cart successful.",
      timeout: 500,
    }).show();
  });
};

// On button click send all details about that juice to updateCard function
addToCartBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let juice = JSON.parse(btn.dataset.juice);
    updateCart(juice);
  });
});

// Alert message on order placed
const alertMsg = document.querySelector("#order_placed_alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change Order status
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hidden_input");
let order = JSON.parse(hiddenInput ? hiddenInput.value : null);
let time = document.createElement("small");

function updateStatus(order) {
  let stepCompleted = true;
  statuses.forEach((status) => {
    status.classList.remove("step_completed");
    status.classList.remove("current");
  });

  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step_completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);

      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}
updateStatus(order);

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
