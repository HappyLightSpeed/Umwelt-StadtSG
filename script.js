// Utility function to extract the date only (YYYY-MM-DD) from the timestamp
function formatDate(timeString) {
    return new Date(timeString).toISOString().split('T')[0];
}

// Fetch and display data for Luftqualität (PM10)
async function fetchLuftqualität() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadAirQuality.php');
        const data = await response.json();

        const latestValue = data[0].pm10_wert; // Replace with the correct key if it's different
        const latestDate = formatDate(data[0].time); 

        // Update the PM10 value in HTML
        document.getElementById('pm10').innerText = `${latestValue} µg/m³ (${latestDate})`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const pm10Values = data.map(entry => entry.pm10_wert); // Replace with the correct key

        // Create the Luftqualität chart
        const ctx = document.getElementById('chartLuftqualität').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'PM10 Feinstaub (µg/m³)',
                    data: pm10Values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Datum'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'PM10 (µg/m³)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching Luftqualität data:', error);
    }
}

// Fetch and display data for CO2
async function fetchCO2() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadCo2.php');
        const data = await response.json();

        const latestValue = data[0].co2_wert;
        const latestDate = formatDate(data[0].time);

        // Update the CO2 value in HTML
        document.getElementById('co2-value').innerText = `${latestValue} ppm (${latestDate})`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const co2Values = data.map(entry => entry.co2_wert);

        // Create the CO2 chart
        const ctx = document.getElementById('chartCO2').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'CO2-Konzentration (ppm)',
                    data: co2Values,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Datum'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'CO2 (ppm)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching CO2 data:', error);
    }
}

// Fetch and display data for Solarstromproduktion
async function fetchSolar() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadStrom.php');
        const data = await response.json();

        const latestValue = data[0].stromproduktion;
        const latestDate = formatDate(data[0].time);

        // Update the Solarstromproduktion value in HTML
        document.getElementById('solar-value').innerText = `${latestValue} kWh (${latestDate})`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const solarValues = data.map(entry => entry.stromproduktion);

        // Create the Solarstromproduktion chart
        const ctx = document.getElementById('chartSolar').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Solarstromproduktion (kWh)',
                    data: solarValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Datum'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'kWh'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching Solarstromproduktion data:', error);
    }
}

// Initialize fetching of data
fetchLuftqualität();
fetchCO2();
fetchSolar();
