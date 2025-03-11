function getWaifus() {
  let type = document.getElementById("type").value.toLowerCase();
  let category = document.getElementById("category").value.toLowerCase();
  const url = `https://api.waifu.pics/many/${type}/${category}`;

  const requestData = { exclude: [] }; // Puedes agregar URLs que quieras excluir en este array

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.files && data.files.length > 0) {
        const cardsContainer = document.getElementById("waifu-cards");
        cardsContainer.innerHTML = ""; // Limpia los resultados anteriores
        data.files.forEach(imageUrl => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img class="image-crop" src="${imageUrl}" alt="${category} image">
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
    });
}
