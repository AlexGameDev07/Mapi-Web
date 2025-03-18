document.addEventListener("DOMContentLoaded", () => {
  const typeCheckbox = document.getElementById("nsfw"); // Usar el id correcto del checkbox
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
    if (!category) return; // Evitar errores si no hay categoría seleccionada

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
    if (!category) return; // Evitar errores si no hay categoría seleccionada

    const url = `https://api.waifu.pics/many/${type}/${category}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exclude: [] })
    })
      .then(response => response.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          const cardsContainer = document.getElementById("waifu-cards");
          cardsContainer.innerHTML = "";
          data.files.forEach(imageUrl => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<img class="image-crop" src="${imageUrl}" alt="${category} image">`;
            cardsContainer.appendChild(card);
          });
        } else {
          document.getElementById("error").textContent = "No se encontraron imágenes.";
        }
      })
      .catch(error => {
        console.error("Error:", error);
        document.getElementById("error").textContent = "Ocurrió un error al obtener las imágenes.";
      });
  }

  window.getWaifus = getWaifus; // Hacer disponible la función en el ámbito global

  typeCheckbox.addEventListener("change", () => {
    updateCategoryOptions();
    getBg();
  });

  categorySelect.addEventListener("change", getBg);

  updateCategoryOptions();
  getBg();
});
