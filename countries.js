/* ============================================
   ZUMAR WONDERLAND
   WORLD EXPLORER — 195 COUNTRIES
============================================ */

const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "São Tomé and Príncipe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Türkiye",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
];

// ============================================
// DISPLAY COUNTRIES ON THE WEBSITE
// ============================================

const countryList = document.getElementById("country-list");
const countrySearch = document.getElementById("country-search");

if (countryList && countrySearch) {

    // Accessible message area for selected countries.

    const countryMessage = document.createElement("div");

    countryMessage.id = "country-message";
    countryMessage.className = "panel";
    countryMessage.setAttribute("aria-live", "polite");

    countryMessage.textContent =
        "Choose a country to begin your discovery! 🌎";

    countryList.before(countryMessage);

    function displayCountries(searchText = "") {

        countryList.replaceChildren();

        const search = searchText.trim().toLowerCase();

        const filteredCountries = countries.filter(country =>
            country.toLowerCase().includes(search)
        );

        if (filteredCountries.length === 0) {
            const message = document.createElement("p");

            message.textContent =
                "No countries found. Try another search!";

            countryList.appendChild(message);

            return;
        }

        filteredCountries.forEach(country => {

            const button = document.createElement("button");

            button.className = "country-card";
            button.type = "button";

            button.textContent = `🌍 ${country}`;

            button.addEventListener("click", () => {

                countryMessage.replaceChildren();

                const title = document.createElement("h2");
                title.textContent = `🌎 ${country}`;

                const description = document.createElement("p");

                description.textContent =
                    `Welcome to ${country}! This is your selected destination. ` +
                    "Its unique explorable environment and activities can be added as we build the world.";

                const selected = document.createElement("p");

                selected.textContent =
                    "⭐ Selected destination";

                countryMessage.append(title, description, selected);

                // Keep track of the selection in this browser.

                try {
                    localStorage.setItem(
                        "zumarSelectedCountry",
                        country
                    );
                } catch (error) {
                    console.warn("Country selection could not be saved.");
                }

                countryList.querySelectorAll("button").forEach(card => {
                    card.setAttribute("aria-pressed", "false");
                });

                button.setAttribute("aria-pressed", "true");
            });

            button.setAttribute("aria-pressed", "false");

            countryList.appendChild(button);
        });
    }

    countrySearch.addEventListener("input", () => {
        displayCountries(countrySearch.value);
    });

    displayCountries();

    console.log(
        `🌍 World Explorer loaded ${countries.length} country choices.`
    );
}

console.log("🌎 Zumar Wonderland World Explorer loaded!");
