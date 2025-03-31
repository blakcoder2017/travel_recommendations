document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-btn");
    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results-popup";
    document.querySelector(".search-container").appendChild(resultsContainer);

    let travelData = {};

    // Fetch JSON data
    fetch("travel_recommendation.json")
        .then(response => response.json())
        .then(data => {
            travelData = data;
        })
        .catch(error => console.error("Error loading JSON:", error));

    // Function to search and display results
    function searchPlaces() {
        const query = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = ""; // Clear previous results

        if (query === "") {
            resultsContainer.style.display = "none";
            return;
        }

        let results = [];

        // Search for beaches
        if (["beach", "beaches"].includes(query)) {
            results = travelData.beaches;
        }
        // Search for temples
        else if (["temple", "temples"].includes(query)) {
            results = travelData.temples;
        }
        // Search for countries (show all countries if "countries" is searched)
        else if (query === "countries") {
            results = travelData.countries.flatMap(country => country.cities);
        }
        // Search for a specific country (show its cities)
        else {
            const foundCountry = travelData.countries.find(country => country.name.toLowerCase() === query);
            if (foundCountry) {
                results = foundCountry.cities;
            }
        }

        // Show results
        if (results.length > 0) {
            results.forEach(place => {
                const placeCard = document.createElement("div");
                placeCard.classList.add("place-card");

                placeCard.innerHTML = `
                    <img src="${place.imageUrl}" alt="${place.name}">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <button class="visit-btn" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(place.name)}', '_blank')">Visit</button>
                `;
                resultsContainer.appendChild(placeCard);
            });
            resultsContainer.style.display = "block";
        } else {
            resultsContainer.innerHTML = `<p class="no-results">No results found. Try searching for 'beach', 'temple', or a country name.</p>`;
            resultsContainer.style.display = "block";
        }
    }

    // Search button event
    searchBtn.addEventListener("click", searchPlaces);

    // Clear button event
    clearBtn.addEventListener("click", function () {
        searchInput.value = "";
        resultsContainer.style.display = "none";
    });
});
