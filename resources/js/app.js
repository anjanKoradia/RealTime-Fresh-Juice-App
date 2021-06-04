import axios from "axios";
import Noty from "noty";

let addToCartBtn = document.querySelectorAll(".add_to_cart_btn");
let cartCounter = document.querySelector(".cart_counter");

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
