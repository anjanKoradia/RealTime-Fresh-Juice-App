/* ---------------------------------------- 
  Increase-Decrease Item Quantity In Cart 
---------------------------------------- */
import axios from "axios";

const cartCounter = document.querySelector(".cart_counter");
const cartTotalAmt = document.querySelector(".cart_total_amt");

const increaseQtyBtn = document.querySelectorAll(".increase_qty");
const decreaseQtyBtn = document.querySelectorAll(".decrease_qty");
const removeItemBtn = document.querySelectorAll(".remove_item_btn");

function setValues(res) {
  cartCounter.innerText = res.data.cart.totalQty;
  cartTotalAmt.innerText = `Rs. ${res.data.cart.totalPrice}`;
}

export default function manageItemQty() {
  // Increase Item Quntity
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

  // Decrease Item Quntity
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

  // Remove Item From Cart
  removeItemBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let juice = JSON.parse(btn.dataset.cartjuice);
      axios.delete(`/cart/remove-item/${juice.item._id}`).then((res) => {
        if (res.data.cart.totalQty <= 0) {
          document.querySelector(".cart").innerHTML = `
            <div class="empty_cart py-5">
              <div class="container text-center">
                <h3 class="fw-bold">Cart Is Empty 😕</h3>
                <p class="text-muted">
                  You probably haven't ordered a juice yet. To order a juice, go to the
                  main page.
                </p>
                <img class="d-block mx-auto my-4" src="/img/empty_cart.png" alt="" />
                <a href="/" class="btn btn_orange go_back_btn">Go Back</a>
              </div>
            </div>
            `
        }
        setValues(res, juice);
        btn.parentElement.parentElement.parentElement.parentElement.remove();
      });
    });
  });
}
