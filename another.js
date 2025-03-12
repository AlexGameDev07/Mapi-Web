document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const nsfwCheckbox = document.getElementById("nsfw");

  function getBg() {
    let category = document.getElementById("category").value.toLowerCase();
    const apiUrl = "https://api.waifu.im/search";
    const limit = 1; // Número de imágenes a cargar
    const isNsfw = document.getElementById("nsfw").checked;

    // Mostrar pantalla de carga
    document.getElementById("loading").style.display = "block";

    // Construimos los parámetros de la solicitud
    const params = {
      included_tags: [category], // Condición para imágenes NSFW
      limit: limit,
    };

    if (isNsfw) {
      params.is_nsfw = true;
    }

    const queryParams = new URLSearchParams();

    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach((value) => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.set(key, params[key]);
      }
    }

    const requestUrl = `${apiUrl}?${queryParams.toString()}`;

    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        // Ocultar pantalla de carga
        document.getElementById("loading").style.display = "none";

        if (data.images && data.images.length > 0) {
          const cardsContainer = document.getElementById("waifu-cards");
          cardsContainer.innerHTML = "";
          const imageUrl = data.images[Math.floor(Math.random() * 20)].url;
          document.body.style.backgroundImage = `url('${imageUrl}')`;
        } else {
          document.getElementById("error").textContent =
            "No se encontraron imágenes.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("error").textContent =
          "Ocurrió un error al obtener las imágenes.";
        // Ocultar pantalla de carga en caso de error
        document.getElementById("loading").style.display = "none";
      });
  }

  function loadCategories(isNsfw) {
    const url = "https://api.waifu.im/tags";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        categorySelect.innerHTML =
          '<option value="" disabled selected>Selecciona una categoría</option>'; // Reinicia las opciones
        if (data) {
          // Agregar categorías normales
          data.versatile.forEach((tag) => {
            const option = document.createElement("option");
            option.value = tag.toLowerCase();
            option.textContent = tag;
            categorySelect.appendChild(option);
          });
          // Agregar categorías NSFW si el checkbox está marcado
          if (isNsfw) {
            data.nsfw.forEach((tag) => {
              const option = document.createElement("option");
              option.value = tag.toLowerCase();
              option.textContent = tag;
              categorySelect.appendChild(option);
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tags:", error);
      });
  }

  // Cargar categorías iniciales (normales)
  loadCategories(false);

  // Agregar evento para cambiar categorías y fondo al marcar/desmarcar el checkbox NSFW
  nsfwCheckbox.addEventListener("change", () => {
    loadCategories(nsfwCheckbox.checked);
  });

  // Cambiar fondo inicial (normal)
});

function getWaifus() {
  let category = document.getElementById("category").value.toLowerCase();
  const apiUrl = "https://api.waifu.im/search";
  const limit = 20; // Número de imágenes a cargar
  const isNsfw = document.getElementById("nsfw").checked;

  // Mostrar pantalla de carga
  document.getElementById("loading").style.display = "block";

  // Construimos los parámetros de la solicitud
  const params = {
    included_tags: [category], // Condición para imágenes NSFW
    limit: limit,
  };

  if (isNsfw) {
    params.is_nsfw = true;
  }

  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      // Ocultar pantalla de carga
      document.getElementById("loading").style.display = "none";

      if (data.images && data.images.length > 0) {
        const cardsContainer = document.getElementById("waifu-cards");
        cardsContainer.innerHTML = ""; // Limpia los resultados anteriores
        data.images.forEach((imageData) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img class="image-crop" src="${imageData.url}" alt="${category} image">
          `;
          cardsContainer.appendChild(card);
          const imageUrl = data.images[Math.floor(Math.random() * 20)].url;
          document.body.style.backgroundImage = `url('${imageUrl}')`;
        });
      } else {
        document.getElementById("error").textContent =
          "No se encontraron imágenes.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("error").textContent =
        "Ocurrió un error al obtener las imágenes.";
      // Ocultar pantalla de carga en caso de error
      document.getElementById("loading").style.display = "none";
    });
}
