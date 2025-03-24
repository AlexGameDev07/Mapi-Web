document.addEventListener("DOMContentLoaded", () => {
  const typeCheckbox = document.getElementById("nsfw");
  const categorySelect = document.getElementById("category");

  const categories = {
    sfw: ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"],
    nsfw: ["waifu", "neko", "trap", "blowjob"]
  };

  function updateCategoryOptions() {
    const type = typeCheckbox.checked ? "nsfw" : "sfw";
    categorySelect.innerHTML = "";
    categories[type].forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  function getBg() {
    let type = typeCheckbox.checked ? "nsfw" : "sfw";
    let category = categorySelect.value;
    if (!category) return;

    const url = `https://api.waifu.pics/${type}/${category}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          document.body.style.backgroundImage = `url('${data.url}')`;
        } else {
          console.error("No image URL found in the response");
        }
      })
      .catch(error => {
        console.error("Error fetching background image:", error);
      });
  }

  function getWaifus() {
    let type = typeCheckbox.checked ? "nsfw" : "sfw";
    let category = categorySelect.value;
    if (!category) return;

    const imageCount = parseInt(document.getElementById("imageCount").value) || 20;

    const url = `https://api.waifu.pics/many/${type}/${category}`;

    document.getElementById("loading-overlay").style.display = "flex";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exclude: [], limit: imageCount })
    })
      .then(response => response.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          const cardsContainer = document.getElementById("waifu-cards");
          cardsContainer.innerHTML = "";

          let loadedImages = 0;
          const limitedImages = data.files.slice(0, imageCount);
          limitedImages.forEach(imageUrl => {

            const card = document.createElement("div");
            card.className = "card";

            const img = document.createElement("img");
            img.className = "image-crop";
            img.src = imageUrl;
            img.alt = `${category} image`;
            img.loading = "lazy";

            img.addEventListener("click", () => openModal(imageUrl));

            img.onload = () => {
              loadedImages++;
              if (loadedImages === data.files.length) {
                document.getElementById("loading-overlay").style.display = "none";
              }
            };

            card.appendChild(img);
            cardsContainer.appendChild(card);
          });
        } else {
          document.getElementById("error").textContent = "No se encontraron imágenes.";
          document.getElementById("loading-overlay").style.display = "none";
        }
      })
      .catch(error => {
        console.error("Error:", error);
        document.getElementById("error").textContent = "Ocurrió un error al obtener las imágenes.";
        document.getElementById("loading-overlay").style.display = "none";
      });
  }


  function openModal(imageUrl) {
    const modalImage = document.getElementById("modalImage");
    const downloadBtn = document.getElementById("downloadImage");

    modalImage.src = imageUrl;
    modalImage.alt = "Imagen en grande";
    downloadBtn.href = imageUrl;
    downloadBtn.download = "imagen_grande.jpg";

    new bootstrap.Modal(document.getElementById("imageModal")).show();
  }

  window.getWaifus = getWaifus;

  typeCheckbox.addEventListener("change", () => {
    updateCategoryOptions();
    getBg();
  });

  categorySelect.addEventListener("change", getBg);

  updateCategoryOptions();
  getBg();
});
