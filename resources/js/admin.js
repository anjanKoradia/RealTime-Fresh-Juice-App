import axios from "axios";
import moment from "moment";
import Noty from "noty";

export default function initAdmin(socket) {
  const adminOrderTableBody = document.querySelector("#adminOrderTableBody");

  let orders = [];
  let markup = ``;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      markup = generateMarkup(orders);
      adminOrderTableBody.innerHTML = markup;
    })
    .catch((error) => {
      console.log(error);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    console.log(parsedItems);
    // map function return array of all item and then we use join() method to join all items in single string
    return parsedItems
      .map((menuItem) => {
        return `
            <p>${menuItem.item.name} - ${menuItem.item.quantity} </p>
        `;
      })
      .join("");
  }

  function generateMarkup(orders) {
    return orders
      .map((order, index) => {
        return `
        <tr>
          <td scope="row">${orders.length - index}</td>
          <td class="text-success">${order._id}</td>
          <td>
            ${renderItems(order.items)}
          </td>
          <td>
            <p><b>Name :</b> ${order.customer_id.name}</p>
            <p><b>Phone-Number :</b> ${order.phone_number}</p>
            <p style="max-width:300px"><b>Address :</b> ${order.address}</p>
          </td>
          <td style="min-width:250px"> 
            <form action="/admin/order/status" method="POST">
              <input type="hidden" name="orderId" value="${order._id}">
              <div class="form-group">
                <select
                  name="status"
                  class="form-control form-select"
                  
                  onchange="this.form.submit()"
                >
                  <option
                    value="Placed"
                    ${order.status === "Placed" ? "selected" : ""}
                  >
                    Placed
                  </option>
                  <option
                    value="Confirmed"
                    ${order.status === "Confirmed" ? "selected" : ""}
                  >
                    Confirmed
                  </option>
                  <option
                    value="Prepared"
                    ${order.status === "Prepared" ? "selected" : ""}
                  >
                    Prepared
                  </option>
                  <option
                    value="Delivered"
                    ${order.status === "Delivered" ? "selected" : ""}
                  >
                    Delivered
                  </option>
                  <option
                    value="Completed"
                    ${order.status === "Completed" ? "selected" : ""}
                  >
                    Completed
                  </option>
                </select>
              </div>
            </form>
          </td>
          <td>
            <p>${moment(order.createdAt).format("Do MMMM YYYY")} ,</p>
            <p>${moment(order.createdAt).format("dddd")} ,</p>
            <p>${moment(order.createdAt).format("hh:mm A")}</p>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  socket.on("orderListUpdated", (order) => {
    new Noty({
      theme: "metroui",
      type: "success",
      text: "New order recived.",
      timeout: 2000,
    }).show();

    orders.unshift(order);
    adminOrderTableBody.innerHTML = "";
    adminOrderTableBody.innerHTML = generateMarkup(orders);
  });
}
