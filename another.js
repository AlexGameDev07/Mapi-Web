function getWaifus() {
    let category = document.getElementById("category").value.toLowerCase();
    const apiUrl = 'https://api.waifu.im/search';
  
    // Mostrar pantalla de carga
    document.getElementById("loading").style.display = "block";
  
    // Construimos los parámetros de la solicitud
    const params = {
      included_tags: [category] // Condición para imágenes NSFW
    };
  
    const queryParams = new URLSearchParams();
  
    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach(value => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.set(key, params[key]);
      }
    }
  
    const requestUrl = `${apiUrl}?${queryParams.toString()}`;
  
    fetch(requestUrl)
      .then(response => response.json())
      .then(data => {
        // Ocultar pantalla de carga
        document.getElementById("loading").style.display = "none";
  
        if (data.images && data.images.length > 0) {
          const cardsContainer = document.getElementById("waifu-cards");
          cardsContainer.innerHTML = ""; // Limpia los resultados anteriores
          data.images.forEach(imageData => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
              <img class="image-crop" src="${imageData.url}" alt="${category} image">
            `;
            cardsContainer.appendChild(card);
          });
        } else {
          document.getElementById("error").textContent = "No se encontraron imágenes.";
        }
      })
      .catch(error => {
        console.error("Error:", error);
        document.getElementById("error").textContent = "Ocurrió un error al obtener las imágenes.";
        // Ocultar pantalla de carga en caso de error
        document.getElementById("loading").style.display = "none";
      });
  }
  