/**==============================================
 **              INITIALIZE
 *?  This function builds the map with different options : zoom, latitude, ... 
 *@param
 *@return map
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

function fetchUsersAndAddMarkers(map) {

    let markers = [];
    const interval = setInterval(() => {
        //nationality = French
        fetch('https://randomuser.me/api/?nat=fr')
            .then(response => response.json())
            .then(data => {
                const { name, location } = data.results[0];
                // We get the first name, lase name and city that we will use in order to get weather data for this city.
                const { first, last } = name;
                const { city } = location;
                fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
                    .then(response => response.json())
                    .then(data => {
                        const { latitude, longitude, country_code } = data.results[0];
                        if (country_code == 'FR') {
                            //console.log(`${first} ${last}, ${city}, ${latitude}, ${longitude}`);
                            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)
                                .then(response => response.json())
                                .then(data => {
                                    const temp = data.hourly.temperature_2m[0];
                                    
                                    if (markers.length >= 10) {
                                        const markerToRemove = markers.shift();
                                        map.removeLayer(markerToRemove);
                                    }
                                    const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(`<span class="city">${city}</span> ${first} ${last} <br> <span id="temp">${temp}</span>`, { autoClose: true, autoPan: false }, { className: 'popup-style' });
                                    

                                    const tempSpan = document.getElementById('temp');
                                    if (temp < 8) {
                                        tempSpan.style.color = 'Cyan';
                                    } else if (temp >= 8 && temp < 18) {
                                        tempSpan.style.color = 'Blue';
                                    } else if (temp >= 18 && temp < 30) {
                                        tempSpan.style.color = 'Coral';
                                    } else {
                                        tempSpan.style.color = 'Red'
                                    }

                                    markers.push(marker);
                                })
                                .catch(error => console.error(error));
                            /* This line is used to put the last marker at the center of the map, it makes the transition a lot smoother
                            const lastMarker = markers[markers.length - 1];
                            map.panTo(lastMarker.getLatLng()); HOWEVER, we won't use it as it doesn't allow the user to select a marker.*/
                        }
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }, 1000);
}

const map = createMap();
fetchUsersAndAddMarkers(map);
