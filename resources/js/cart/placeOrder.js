import axios from "axios";
import Noty from "noty";

const orderForm = document.querySelector("#order_form")

function postOrder(data) {
    axios.post("/orders", data).then(res => {
        new Noty({
            theme: "metroui",
            type: res.data.status,
            text: res.data.message,
            timeout: 1000,
        }).show();

        if (res.data.status == "success") {
            setTimeout(() => {
                window.location.href = "/customer/orders";
            }, 1200);
        }
    }).catch(err => {
        new Noty({
            theme: "metroui",
            type: "error",
            text: err,
            timeout: 1000,
        }).show();
    })
}

export default function placeOrder() {
    if (orderForm) {
        orderForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let formData = new FormData(orderForm);
            let formDataObj = {};

            for (const [key, value] of formData.entries()) {
                formDataObj[key] = value;
            }

            postOrder(formDataObj);
        })
    }
}