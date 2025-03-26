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

  function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex'; // Mostrar la pantalla de carga
  }

  function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none'; // Ocultar la pantalla de carga
  }

  async function getWaifus() {
    try {
      showLoading(); // Mostrar la pantalla de carga al iniciar la búsqueda

      const category = document.getElementById('category').value;
      const nsfw = document.getElementById('nsfw').checked;
      const imageCount = parseInt(document.getElementById('imageCount').value, 10);

      if (!category) {
        throw new Error('Por favor selecciona una categoría.');
      }

      const images = [];
      for (let i = 0; i < imageCount; i++) {
        const response = await fetch(`https://api.waifu.pics/${nsfw ? 'nsfw' : 'sfw'}/${category}`);
        if (!response.ok) {
          throw new Error('Error al obtener las imágenes.');
        }

        const data = await response.json();
        if (data.url) {
          images.push(data.url); // Agregar la URL de la imagen al array
        } else {
          throw new Error('La respuesta de la API no contiene una URL de imagen.');
        }
      }

      displayImages(images); // Mostrar las imágenes obtenidas
    } catch (error) {
      const errorDiv = document.getElementById('error');
      errorDiv.textContent = error.message;
    } finally {
      hideLoading(); // Ocultar la pantalla de carga al finalizar
    }
  }

  function displayImages(images) {
    const waifuCards = document.getElementById('waifu-cards');
    waifuCards.innerHTML = ''; // Limpiar contenido previo

    images.forEach((image) => {
      const card = document.createElement('div'); // Crear un contenedor para la tarjeta
      card.className = 'card'; // Aplicar la clase 'card'

      const imgElement = document.createElement('img');
      imgElement.src = image;
      imgElement.alt = 'Waifu';
      imgElement.className = 'waifu-image'; // Clase para la imagen
      imgElement.onclick = () => openModal(image); // Agregar evento onclick

      card.appendChild(imgElement); // Agregar la imagen al contenedor
      waifuCards.appendChild(card); // Agregar la tarjeta al contenedor principal
    });
  }

  function openModal(imageUrl) {
    const modalImage = document.getElementById("modalImage");
    const downloadBtn = document.getElementById("downloadImage");

    modalImage.src = imageUrl; // Establecer la URL de la imagen en el modal
    modalImage.alt = "Imagen en grande";
    downloadBtn.href = imageUrl; // Establecer el enlace de descarga
    downloadBtn.download = "imagen_grande.jpg";

    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
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
