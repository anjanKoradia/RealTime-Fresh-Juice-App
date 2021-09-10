const imgDropZone = document.querySelector(".drop_img_container");
const browseBtn = document.querySelector(".browse_btn");
const fileInput = document.querySelector("#fileInput");

export default function addJuice() {
  imgDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!imgDropZone.classList.contains("draged")) {
      imgDropZone.classList.add("draged");
    }
  });

  imgDropZone.addEventListener("dragleave", (e) => {
    imgDropZone.classList.remove("draged");
  });

  imgDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    imgDropZone.classList.remove("draged");

    // let file = e.dataTransfer.files;
    // fileInput.files = file[0];
    // if (file.lenght) {
    //   fileInput.files = file;
    // }
  });

  browseBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    imgDropZone.innerHTML = `${fileInput.files[0].name} is selected.`;
  });
}
