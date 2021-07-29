import axios from "axios";
import Noty from "noty";

const cartCounter = document.querySelector(".cart_counter");
const cartTotalAmt = document.querySelector(".cart_total_amt");
const addToCartBtn = document.querySelectorAll(".add_to_cart_btn");
const increaseQtyBtn = document.querySelectorAll(".increase_qty");
const decreaseQtyBtn = document.querySelectorAll(".decrease_qty");
const removeItemBtn = document.querySelectorAll(".remove_item_btn");

export function addToCart() {
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
}

function setValues(res) {
  cartCounter.innerText = res.data.cart.totalQty;
  cartTotalAmt.innerText = `Rs. ${res.data.cart.totalPrice}`;
}

export function increaseItemQty() {
  increaseQtyBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let juice = JSON.parse(btn.dataset.cartjuice);
      axios.put(`/cart/increase-qty/${juice.item._id}`).then((res) => {
        btn.previousElementSibling.innerText =
          res.data.cart.items[juice.item._id].qty;
        setValues(res);
      });
    });
  });
}

export function decreaseItemQty() {
  decreaseQtyBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let juice = JSON.parse(btn.dataset.cartjuice);
      axios.put(`/cart/decrease-qty/${juice.item._id}`).then((res) => {
        btn.nextElementSibling.innerText =
          res.data.cart.items[juice.item._id].qty;
        setValues(res, juice);
      });
    });
  });
}

export function removeItem() {
  removeItemBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let juice = JSON.parse(btn.dataset.cartjuice);
      axios.delete(`/cart/remove-item/${juice.item._id}`).then((res) => {
        setValues(res, juice);
        btn.parentElement.parentElement.parentElement.parentElement.remove();
      });
    });
  });
}
