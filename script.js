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
 **              fetchTemp
 *?  What does it do?
 *@param latitude Flaot
 *@param longitude Float  
 *@return Int
 *=============================================**/
async function fetchTemp(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const data = await response.json();
        const temp = data.current_weather.temperature;
        return temp;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**==============================================
 **              editTempSpan
 *?  This function changes the color of the temperature span in order to put a color according to the temperature (cyan for cold, blue for fresh , orange for warmred for hot) ?
 *@param temp Int
 *@param tempSpan Span  
 *@return None
 *=============================================**/
function editTempSpan(temp, tempSpan) {
    tempSpan.textContent = temp + "°C"; // Set the text content of the span element
    tempSpan.setAttribute("id", "temp"); // Add the id attribute to the span element
    if (temp < 9) {
        tempSpan.classList.add("cold");
        tempSpan.classList.remove("fresh");
        tempSpan.classList.remove("warm");
        tempSpan.classList.remove("hot");
    } else if (temp >= 9 && temp < 16) {
        tempSpan.classList.add("fresh");
        tempSpan.classList.remove("cold");
        tempSpan.classList.remove("warm");
        tempSpan.classList.remove("hot");
    } else if (temp >= 16 && temp < 22) {
        tempSpan.classList.add("warm");
        tempSpan.classList.remove("cold");
        tempSpan.classList.remove("fresh");
        tempSpan.classList.remove("hot");
    } else if (temp >= 22) {
        tempSpan.classList.add("hot");
        tempSpan.classList.remove("cold");
        tempSpan.classList.remove("warm");
        tempSpan.classList.remove("fresh");
    }

}

/**================================================================================================
 *                                         Main
 * ? This function is used to user all of our functions defined above ?
 *================================================================================================**/
async function main() {
    let markers = []; // We store the differents markers in a list
        const user = await fetchUser(); // format : [first name, last name, city];
        console.log(user);
        const coords = await fetchCoords(user); // format : [latitude, longitude, country_code]
        console.log(coords);

        // This condition avoids us getting markers outside of France.
        if (coords[2] == 'FR') {
            const temp = await fetchTemp(coords[0], coords[1]);
            console.log(temp);
            const tempSpan = document.createElement("span"); // Create a span element
            const marker = L.marker([coords[0], coords[1]]); // Create a marker on the coords given.
            editTempSpan(temp, tempSpan);
            const popupContent = `<span class="city">${user[2]}</span><div>${user[0]} ${user[1]}</div> <br> <div>${tempSpan.outerHTML}</div>`;

            if (markers.length >= 10) {
                const markerToRemove = markers.shift();
                map.removeLayer(markerToRemove);
            }
            marker.addTo(map)
                .bindPopup(popupContent, { autoClose: true, autoPan: false }, { className: 'popup-style' });
            markers.push(marker);
        }
}

//Creating the map
const map = createMap();

//setInterval in order to add one marker to the map every second
const intervalId = setInterval(() => {
    main();
}, 1000);