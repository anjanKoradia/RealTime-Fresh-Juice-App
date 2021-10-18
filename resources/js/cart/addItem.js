/* ---------------------------------------- 
  Add Item In Cart 
---------------------------------------- */

import axios from "axios";
import moment from "moment";
import Noty from "noty";

const cartCounter = document.querySelector(".cart_counter");
const addToCartBtn = document.querySelectorAll(".add_to_cart_btn");

const statuses = document.querySelectorAll(".status_line");
const hiddenInput = document.querySelector("#hidden_input");
const order = JSON.parse(hiddenInput ? hiddenInput.value : null);
const time = document.createElement("small");

// In navbar display total orders and when it added to cart show success popup
function updateCart(juice) {
  axios.post("/update-cart", juice).then((res) => {
    cartCounter.innerText = res.data.totalQty;
    new Noty({
      theme: "metroui",
      type: "success",
      text: "Item added to cart successful.",
      timeout: 1000,
    }).show();
  });
}

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

export default function addToCart(socket) {
  // On button click send all details about that juice to updateCard function
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let juice = JSON.parse(btn.dataset.juice);
      updateCart(juice);
    });
  });

  updateStatus(order);

  /* ---------------------------------------- 
    Socket 
  ---------------------------------------- */

  // Join
  if (order) {
    socket.emit("join", `order_${order._id}`);
  }

  // Update order list in real time
  const adminAreaPath = window.location.pathname;
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
}
