/* ---------------------------------------- 
  Delete Juice From Memu 
---------------------------------------- */

import axios from "axios";
import Noty from "noty";

const deleteJuiceBtn = document.querySelector(".delete_juice_btn");

const deleteRoute = (juiceId) => {
  axios.delete(`/admin/menu/editJuice/${juiceId}/delete`).then((res) => {
    new Noty({
      theme: "metroui",
      type: "error",
      text: "Juice deleted successfully from database.",
      timeout: 2000,
    }).show();

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  });
};

export default function deleteJuice() {
  if (deleteJuiceBtn) {
    deleteJuiceBtn.addEventListener("click", () => {
      const juiceId = JSON.parse(deleteJuiceBtn.dataset.juice_id);
      deleteRoute(juiceId);
    });
  }
}
