import axios from "axios";
import Noty from "noty";

const orderForm = document.querySelector("#order_form")

function checkPaymentStatus(paymentDetails) {
    axios.post("/order/razorpay/is-order-complete", paymentDetails).then((res) => {
        new Noty({
            theme: "metroui",
            type: res.data.status,
            text: res.data.message,
            timeout: 1000,
        }).show();

        if (res.data.status == "success") {
            setTimeout(() => {
                window.location.href = "/customer/orders";
            }, 500);
        }
    }).catch((err) => {
        new Noty({
            theme: "metroui",
            type: "error",
            text: "Somthing went wrong. Try again",
            timeout: 1000,
        }).show();
    })
}

function payAmount(data) {
    axios.post("/order/razorpay", data).then(res => {
        if (res.data.status == "error") {
            return new Noty({
                theme: "metroui",
                type: "error",
                text: res.data.message,
                timeout: 1000,
            }).show();
        }

        let options = {
            "key": process.env.RAZORPAY_KEY_ID,
            "amount": res.data.amount,
            "currency": "INR",
            "name": "Fresh Juice",
            "description": "Juice Order",
            "order_id": res.data.id,
            "handler": function (res) {
                checkPaymentStatus(res);
            },
            "prefill": {
                "name": res.data.notes.customer_name,
                "email": res.data.notes.customer_email,
                "contact": res.data.notes.customer_number
            },
            "theme": {
                "color": "#3399cc"
            },
        };

        let rzp1 = new Razorpay(options);
        rzp1.open();
    }).catch(err => {
        new Noty({
            theme: "metroui",
            type: "error",
            text: "Somthing went wrong. Try again",
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
            payAmount(formDataObj);
        })
    }
}