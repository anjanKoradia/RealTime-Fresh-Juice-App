const imgDropZone = document.querySelector(".drop_img_container");
const browseBtn = document.querySelector(".browse_btn");
const fileInput = document.querySelector("#fileInput");

function updateThumbnail(file) {
  let thumbnailElement = imgDropZone.querySelector(".drop_zone_thumb");

  if (imgDropZone.querySelector("i") && imgDropZone.querySelector("p")) {
    imgDropZone.querySelector("i").remove();
    imgDropZone.querySelector("p").remove();
  }

  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop_zone_thumb");
    imgDropZone.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

export default function addJuice() {
  if (browseBtn) {
    browseBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      if (fileInput.files.length) {
        updateThumbnail(fileInput.files[0]);
      }
    });
  }

  if (imgDropZone) {
    imgDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!imgDropZone.classList.contains("draged")) {
        imgDropZone.classList.add("draged");
      }
    });

    ["dragleave", "drop"].forEach((type) => {
      imgDropZone.addEventListener(type, (e) => {
        imgDropZone.classList.remove("draged");
      });
    });

    imgDropZone.addEventListener("drop", (e) => {
      e.preventDefault();

      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateThumbnail(e.dataTransfer.files[0]);
      }
      imgDropZone.classList.remove("draged");
    });
  }
}
