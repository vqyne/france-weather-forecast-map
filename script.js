/**==============================================
 **              createMap
 *? This function builds the map using differents options : zoom, latitude. ?
 *@param None
 *@return any
 *=============================================**/

function createMap() {

    //We set the coords 46.000, 2.000 which represents the center of the France, 6 is an option for the zoom.
    var map = L.map('mapstyle').setView([46.000, 2.000], 6);

    // This is a OpenStreetMap layer that we will be adding to the map.
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 30
    });

    osmLayer.addTo(map);

    return (map);
}

/**==============================================
 **              fetchUser
 *? This function fetches a random user informations using an API to bring first name, last name, city name. ?
 *@param None 
 *@return Array
 *=============================================**/
async function fetchUser() {
    try {
        const response = await fetch('https://randomuser.me/api/?nat=fr');
        const data = await response.json();
        const { name, location } = data.results[0];
        const { first, last } = name;
        const { city } = location;
        return [first, last, city];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**==============================================
 **              fetchCoords
 *? This function fetches information from a city using an API to bring coords. ?
 *@param user 
 *@return Array
 *=============================================**/
async function fetchCoords(user) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${user[2]}`);
        const data = await response.json();
        const { latitude, longitude, country_code } = data.results[0];
        return [latitude, longitude, country_code];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**==============================================
 **              fetchTempAndWeatherCode
 *?  What does it do?
 *@param latitude Flaot
 *@param longitude Float  
 *@return Int
 *=============================================**/
async function fetchTempAndWeatherCode(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const data = await response.json();
        const temp = data.current_weather.temperature;
        const weatherCode = data.current_weather.weathercode;
        return [temp, weatherCode];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**==============================================
 **              editTempSpan
 *?  This function changes the color of the temperature span in order to put a color according to the temperature (cyan for cold, blue for fresh , orange for warm, red for hot) ?
 *@param temp Int
 *@param tempSpan Span  
 *@return None
 *=============================================**/
function editTempSpan(temp, tempSpan) {
    tempSpan.textContent = temp + "°C"; // Set the text content of the span element
    tempSpan.setAttribute("id", "temp"); // Add the id attribute to the span element
    switch (true) {
        case (temp < 9): //if temperature below 9 degrees we put cold color
            tempSpan.classList.add("cold");
            tempSpan.classList.remove("fresh");
            tempSpan.classList.remove("warm");
            tempSpan.classList.remove("hot");
            break;
        case (temp >= 9 && temp < 16): //if temperature between 9 & 16 degrees we put fresh color
            tempSpan.classList.add("fresh");
            tempSpan.classList.remove("cold");
            tempSpan.classList.remove("warm");
            tempSpan.classList.remove("hot");
            break;
        case (temp >= 16 && temp < 22): //if temperature between 16 & 22 degrees we put warm color
            tempSpan.classList.add("warm");
            tempSpan.classList.remove("cold");
            tempSpan.classList.remove("fresh");
            tempSpan.classList.remove("hot");
            break;
        case (temp > 22): //if temperature above 22 degrees we put hot color
            tempSpan.classList.add("hot");
            tempSpan.classList.remove("cold");
            tempSpan.classList.remove("warm");
            tempSpan.classList.remove("fresh");
            break;
    }
}

/**==============================================
 **              editWeatherCodeSpan
 *?  This function changes the color of the weatherCode span in order to put a color according to the weatherCode ?
 *@param temp Int
 *@param tempSpan Span  
 *@return None
 *=============================================**/
function editWeatherCodeSpan(weatherCode, weatherCodeSpan) {
    weatherCodeSpan.setAttribute("id", "weather"); // Add the id attribute to the span element
    switch (true) {
        case (weatherCode == 0):
            weatherCodeSpan.textContent = "Clear sky"; // Set the text content of the span element
            break;
        case (weatherCode == 1):
            weatherCodeSpan.textContent = "Mainly clear";
            break;
        case (weatherCode == 2):
            weatherCodeSpan.textContent = "Partly cloudy";
            break;
        case (weatherCode == 3):
            weatherCodeSpan.textContent = "Overcast";
            break;
        case (weatherCode == 45):
            weatherCodeSpan.textContent = "Fog";
            break;
        case (weatherCode == 48):
            weatherCodeSpan.textContent = "Depositing rime fog";
            break;
        case (weatherCode == 51):
            weatherCodeSpan.textContent = "Drizzle: light intensity";
            break;
        case (weatherCode == 53):
            weatherCodeSpan.textContent = "Drizzle: moderate intensity";
            break;
        case (weatherCode == 55):
            weatherCodeSpan.textContent = "Drizzle: dense intensity";
            break;
        case (weatherCode == 56):
            weatherCodeSpan.textContent = "Freezing Drizzle: light intensity";
            break;
        case (weatherCode == 57):
            weatherCodeSpan.textContent = "Freezing Drizzle: dense intensity";
            break;
        case (weatherCode == 61):
            weatherCodeSpan.textContent = "Rain: slight intensity";
            break;
        case (weatherCode == 63):
            weatherCodeSpan.textContent = "Rain: moderate intensity";
            break;
        case (weatherCode == 65):
            weatherCodeSpan.textContent = "Rain: heavy intensity";
            break;
        case (weatherCode == 66):
            weatherCodeSpan.textContent = "Freezing rain: light intensity";
            break;
        case (weatherCode == 67):
            weatherCodeSpan.textContent = "Freezing rain: heavy intensity";
            break;
        case (weatherCode == 71):
            weatherCodeSpan.textContent = "Snow fall: slight intensity";
            break;
        case (weatherCode == 73):
            weatherCodeSpan.textContent = "Snow fall: moderate intensity";
            break;
        case (weatherCode == 75):
            weatherCodeSpan.textContent = "Snow fall: heavy intensity";
            break;
        case (weatherCode == 77):
            weatherCodeSpan.textContent = "Snow grains";
            break;
        case (weatherCode == 80):
            weatherCodeSpan.textContent = "Rain showers: slight";
            break;
        case (weatherCode == 81):
            weatherCodeSpan.textContent = "Rain showers: moderate";
            break;
        case (weatherCode == 82):
            weatherCodeSpan.textContent = "Rain showers: violent";
            break;
        case (weatherCode == 85):
            weatherCodeSpan.textContent = "Snow showers slight";
            break;
        case (weatherCode == 86):
            weatherCodeSpan.textContent = "Snow showers heavy";
            break;
        case (weatherCode == 95):
            weatherCodeSpan.textContent = "Thunderstorm: slight or moderate";
            break;
        case (weatherCode == 96):
            weatherCodeSpan.textContent = "Thunderstorm with slight hail";
            break;
        case (weatherCode == 99):
            weatherCodeSpan.textContent = "Thunderstorm with heavy hail";
            break;

    }
}

/**==============================================
 **              editMarker
 *?  This function changes the color of the marker in order to put a color according to the temperature (cyan for cold, blue for fresh , orange for warm, red for hot) ?
 *@param temp Int
 *@param tempSpan Span  
 *@return None
 *=============================================**/
function editMarker(temp, marker, latitude, longitude) {
    switch (true) {
        case (temp < 9): //if temperature below 9 degrees we put cold color
            marker = L.marker([latitude, longitude], {
                icon: new L.Icon({
                    iconUrl: 'assets/marker-icon-cyan.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            })
            break;
        case (temp >= 9 && temp < 16): //if temperature between 9 & 16 degrees we put fresh color
            marker = L.marker([latitude, longitude], {
                icon: new L.Icon({
                    iconUrl: 'assets/marker-icon-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            })
            break;
        case (temp >= 16 && temp < 22): //if temperature between 16 & 22 degrees we put warm color
            marker = L.marker([latitude, longitude], {
                icon: new L.Icon({
                    iconUrl: 'assets/marker-icon-orange.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            })
            break;
        case (temp > 22): //if temperature above 22 degrees we put hot color
            marker = L.marker([latitude, longitude], {
                icon: new L.Icon({
                    iconUrl: 'assets/marker-icon-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            })
            break;
    }
    return marker; //we return the marker in order to add it to the map later.
}

/**==============================================
 **              Sleep
 *?  This function is used to wait for a specified number of milliseconds before continuing ?
 *@param ms Int
 *@return Promise
 *=============================================**/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**================================================================================================
 *                                         Main
 * ? The purpose of this function is to use all of our functions defined above ?
 *================================================================================================**/
async function main() {
    let markers = []; // We store the differents markers in a list

    while (true) {
        const user = await fetchUser(); // user format : [first name, last name, city];
        //console.log(user);
        const coords = await fetchCoords(user); // coords format : [latitude, longitude, country_code]
        //console.log(coords);

        // This condition avoids us getting markers outside of France.
        if (coords[2] == 'FR') {
            const temp = await fetchTempAndWeatherCode(coords[0], coords[1]);
            console.log(temp);
            //console.log(temp);
            const tempSpan = document.createElement("span"); // Create a span element for temperature
            const weatherCodeSpan = document.createElement("span"); // Create a span element for weather code message
            const marker = L.marker([coords[0], coords[1]]); // Create a marker on the coords given.
            editTempSpan(temp[0], tempSpan);
            editWeatherCodeSpan(temp[1], weatherCodeSpan);

            const popupContent = `<span class="city">${user[2]}</span><div>${user[0]} ${user[1]}</div> <br> <div>${tempSpan.outerHTML}</div> <br> <div>${weatherCodeSpan.outerHTML}</div>`;

            //Delete the first marker if the list reaches 10 elements.
            if (markers.length >= 10) {
                const markerToRemove = markers.shift();
                map.removeLayer(markerToRemove);
            }

            const editedMarker = editMarker(temp[0], marker, coords[0], coords[1]);

            editedMarker.addTo(map)
                .bindPopup(popupContent, { autoClose: true, autoPan: false }, { className: 'popup-style' });
            markers.push(editedMarker);

        }
        await sleep(1000); // wait for 1 second before executing the next iteration
        //console.log(markers.length);
    }
}


//Creating the map
const map = createMap();

main();