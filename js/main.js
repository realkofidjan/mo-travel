// URL of the CSV file on the server
const csvFileUrl = "city_coordinates.csv";

// Fetch and process the CSV file
fetch(csvFileUrl)
  .then((response) => response.text())
  .then((csvContent) => populateDropdown(csvContent))
  .catch((error) => console.error("Error fetching the CSV file:", error));

function populateDropdown(csvContent) {
  const dropdown = document.getElementById("destination");
  const rows = csvContent.split("\n");

  // Skip the header row and loop through the remaining rows
  rows.slice(1).forEach((row) => {
    // Skip empty rows
    if (!row.trim()) return;

    const columns = row.split(",");

    // Columns are in the order: latitude, longitude, city, country
    if (columns.length >= 4) {
      const city = columns[2].trim();
      const country = columns[3].trim();
      const optionText = `${city}, ${country}`;
      const value = `${columns[0].trim()},${columns[1].trim()}, ${city}, ${country}`;

      const option = document.createElement("option");
      option.value = value;
      option.text = optionText;
      dropdown.appendChild(option);
    }
  });
}

function formatDate(dateString) {
    dateString = String(dateString);
    // Assuming dateString is in the format "yyyyMMdd"
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Create a Date object using the extracted parts
    const date = new Date(`${year}-${month}-${day}`);

    // Define arrays for day and month names
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the day of the week, day of the month, and the month
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];

    // Format the date as "ddd dd mmmm"
    return `${dayName} ${dayNum} ${monthName}`;
}

// Asyncy Function for fetching the weather data based on selected option
async function fetchWeather() {
  const dropdown = document.getElementById("destination");
  const selectedOption = dropdown.options[dropdown.selectedIndex];

  // Extracting the longitude and latitude from the selected option
  const longitude = selectedOption.value.split(",")[0];
  const latitude = selectedOption.value.split(",")[1];

  // URL for fetching the weather data
  const weatherUrl = `https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`;

  try {
    const response = await fetch(weatherUrl);
    const weatherData = await response.json();

    // Clearing existing child
    const old_cards = document.getElementById("weather-cards");
    while (old_cards.firstChild) {
      old_cards.removeChild(old_cards.lastChild);
    }

    for (const day of weatherData.dataseries) {
      var date = day.date;
      const high = day.temp2m.max;
      const low = day.temp2m.min;
      var icon = day.weather;
      var forecast = day.weather;

      // Formatting the date
      const formattedDate = formatDate(date);
    
    //   Setting the forecast based on the icon (Civillist format)
      if (icon === "clear") {
        forecast = "Clear sky";
      } else if (icon === "pcloudy") {
        forecast = "Partly cloudy";
      } else if (forecast === "lightrain") {
        forecast = "Light Rain or Showwers";
      } else if (icon === "cloudy") {
        forecast = "Very Cloudy";
      } else if (icon === "fog") {
        forecast = "Foggy Skies";
      } else if (icon === "humid") {
        forecast = "Foggy Skies";
      } else if (icon === "lightsnow") {
        forecast = "Light Snow";
      } else if (icon === "ishower") {
        forecast = "Isolated Showers";
      } else if (icon === "rain") {
        forecast = "Rains";
      } else if (icon === "windy") {
        forecast = "Windy";
      } else if (icon === "mcloudy") {
        forecast = "Cloudy";
      } else if (icon === "rainsnow") {
        forecast = "Mixed";
      } else if (icon === "tstorm") {
        forecast = "Thunderstorm Possible";
      } else if (icon === "tsrain") {
        forecast = "Thunderstorm";
      } else if (icon === "oshower") {
        forecast = "Occasional Showers";
      } else if (icon === "snow") {
        forecast = "Snow";
      } else if (icon === "ts") {
        forecast = "Thunderstorm";
        icon = "tsrain";
      }

      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm";
      card.innerHTML = `
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">${formattedDate}</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">
            ${high} &degC <small class="text-muted">/ ${low} &degC</small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4">
                <li><img src="images/${icon}.png" alt="${icon}"></li>
                <li>${forecast}</li>
            </ul>
        </div>
        `;

      // Settting the cards
      document.getElementById("weather-cards").appendChild(card);
    }
  } catch (error) {
    console.error("Error fetching the weather data:", error);
  }
}
