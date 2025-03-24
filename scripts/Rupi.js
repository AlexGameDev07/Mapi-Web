document.addEventListener("DOMContentLoaded", () => {
   const categorySelect = document.getElementById("category");
   const nsfwCheckbox = document.getElementById("nsfw");

   function getBg() {
      let tags = categorySelect.value || "1girl"; // Default tag if none selected
      const apiUrl = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index";
      const limit = 1; // Number of images to load

      // Show loading screen
      document.getElementById("loading").style.display = "block";

      // Build the request parameters
      const params = new URLSearchParams({
         limit: limit,
         tags: tags,
         json: 1
      });

      const requestUrl = `${apiUrl}&${params.toString()}`;

      fetch(requestUrl)
         .then((response) => response.json())
         .then((data) => {
            // Hide loading screen
            document.getElementById("loading").style.display = "none";

            if (data && data.length > 0) {
               const imageUrl = data[0].file_url;
               document.body.style.backgroundImage = `url('${imageUrl}')`;
            } else {
               document.getElementById("error").textContent = "No se encontraron imágenes.";
            }
         })
         .catch((error) => {
            console.error("Error:", error);
            document.getElementById("error").textContent = "Ocurrió un error al obtener las imágenes.";
            // Hide loading screen in case of error
            document.getElementById("loading").style.display = "none";
         });
   }

   // Load initial background
   getBg();

   function loadCategories() {
      const url = "https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&json=1&limit=100";
      fetch(url)
         .then((response) => response.json())
         .then((data) => {
            categorySelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
            if (data) {
               data.forEach((tag) => {
                  const option = document.createElement("option");
                  option.value = tag.name;
                  option.textContent = tag.name;
                  categorySelect.appendChild(option);
               });
            }
         })
         .catch((error) => {
            console.error("Error al obtener los tags:", error);
         });
   }

   // Load initial categories
   loadCategories();

   // Add event to change background when a new category is selected
   categorySelect.addEventListener("change", getBg);
});

function getWaifus() {
   let tags = document.getElementById("category").value || "1girl";
   const apiUrl = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index";
   const limit = 20; // Number of images to load

   // Show loading screen
   document.getElementById("loading").style.display = "block";

   // Build the request parameters
   const params = new URLSearchParams({
      limit: limit,
      tags: tags,
      json: 1
   });

   const requestUrl = `${apiUrl}&${params.toString()}`;

   fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
         // Hide loading screen
         document.getElementById("loading").style.display = "none";

         if (data && data.length > 0) {
            const cardsContainer = document.getElementById("waifu-cards");
            cardsContainer.innerHTML = ""; // Clear previous results
            data.forEach((imageData) => {
               const card = document.createElement("div");
               card.className = "card";
               card.innerHTML = `
            <img class="image-crop" src="${imageData.preview_url}" alt="${tags} image" onclick="showImageModal('${imageData.file_url}') loading="lazy">
          `;
               cardsContainer.appendChild(card);
            });
         } else {
            document.getElementById("error").textContent = "No se encontraron imágenes.";
         }
      })
      .catch((error) => {
         console.error("Error:", error);
         document.getElementById("error").textContent = "Ocurrió un error al obtener las imágenes.";
         // Hide loading screen in case of error
         document.getElementById("loading").style.display = "none";
      });
}

function showImageModal(imageUrl) {
   const modalImage = document.getElementById("modalImage");
   modalImage.src = imageUrl;
   const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
   imageModal.show();
}