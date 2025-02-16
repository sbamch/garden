document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = `plants.json?v=${new Date().getTime()}`; // Cache-busting

  fetch(jsonUrl, { cache: "no-store" }) // Ensures latest JSON is fetched
      .then(response => response.json())
      .then(data => {
          const urlParams = new URLSearchParams(window.location.search);
          const plantName = urlParams.get('plant');

          if (plantName) {
              const formattedPlantName = plantName.toLowerCase().replace(/\s+/g, '_');
              if (data.plants && data.plants[formattedPlantName]) {
                  window.location.href = data.plants[formattedPlantName]; // Redirect to latest PDF
              } else {
                  document.getElementById('message').innerText = "Plant data not found!";
              }
          } else {
              document.getElementById('message').innerText = "Select a plant to view its details.";
          }

          // Load Plant Buttons
          const plantButtonsDiv = document.getElementById('plant-buttons');
          plantButtonsDiv.innerHTML = "";
          const plantNames = Object.keys(data.plants);

          // Update Tree Count
          document.getElementById('tree-count').innerText = `Total Trees: ${plantNames.length}`;

          plantNames.forEach(plant => {
              const button = document.createElement('button');
              button.innerText = plant.replace(/_/g, ' ').toUpperCase();
              button.onclick = () => window.location.href = `index.html?plant=${plant}`;
              button.classList.add('plant-button');
              button.setAttribute("data-plant", plant.toLowerCase()); // Store name for search
              plantButtonsDiv.appendChild(button);
          });
      })
      .catch(error => {
          console.error('Error loading plant data:', error);
          document.getElementById('message').innerText = "Error loading plant data!";
      });
});

// 🔍 Search Function
function searchPlants() {
  const searchInput = document.getElementById("searchBox").value.toLowerCase();
  const buttons = document.querySelectorAll(".plant-button");

  buttons.forEach(button => {
      const plantName = button.getAttribute("data-plant");
      if (plantName.includes(searchInput)) {
          button.style.display = "inline-block"; // Show matching buttons
      } else {
          button.style.display = "none"; // Hide non-matching buttons
      }
  });

  // Update tree count to show only filtered plants
  const visibleButtons = document.querySelectorAll(".plant-button:not([style*='display: none'])");
  document.getElementById('tree-count').innerText = `Total Trees: ${visibleButtons.length}`;
}
