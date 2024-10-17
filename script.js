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
        // Remove the date from being displayed with the value
        document.getElementById('pm10').innerText = `${latestValue} µg/m³`; // Only show value

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const pm10Values = data.map(entry => entry.pm10_wert); // Replace with the correct key

        return { labels, pm10Values }; // Return for combined chart
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
        // Remove the date from being displayed with the value
        document.getElementById('co2-value').innerText = `${latestValue} ppm`; // Only show value

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const co2Values = data.map(entry => entry.co2_wert);

        return { labels, co2Values }; // Return for combined chart
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
        // Remove the date from being displayed with the value
        document.getElementById('solar-value').innerText = `${latestValue} kWh`; // Only show value

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const solarValues = data.map(entry => entry.stromproduktion);

        return { labels, solarValues }; // Return for combined chart
    } catch (error) {
        console.error('Error fetching Solarstromproduktion data:', error);
    }
}

// Create a combined chart for the last week
async function createCombinedChart() {
    try {
        const luftData = await fetchLuftqualität();
        const co2Data = await fetchCO2();
        const solarData = await fetchSolar();

        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        // Filter for the last 7 days
        const labels = [];
        const pm10Values = [];
        const co2Values = [];
        const solarValues = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(last7Days);
            date.setDate(date.getDate() + i);
            const dateString = formatDate(date);

            labels.push(dateString);
            pm10Values.push(luftData.pm10Values[luftData.labels.indexOf(dateString)] || 0);
            co2Values.push(co2Data.co2Values[co2Data.labels.indexOf(dateString)] || 0);
            solarValues.push(solarData.solarValues[solarData.labels.indexOf(dateString)] || 0);
        }

        // Create the combined chart
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'PM10 Feinstaub (µg/m³)',
                        data: pm10Values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'CO2-Konzentration (ppm)',
                        data: co2Values,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Solarstromproduktion (kWh)',
                        data: solarValues,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    }
                ]
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
                            text: 'Werte'
                        },
                        beginAtZero: true,
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating combined chart:', error);
    }
}

// Function to update value descriptions dynamically based on data
function updateDescriptions(luft, co2, solar) {
    let valueDescription = '';
    if (luft < 50 && co2 < 1000 && solar > 100) {
        valueDescription = 'Die Umweltbedingungen sind heute gut. Die Luftqualität ist hervorragend, CO2-Konzentrationen sind niedrig und die Solaranlagen produzieren viel Strom.';
    } else if (luft >= 50) {
        valueDescription = 'Die Feinstaubbelastung ist höher als normal. Es wird empfohlen, Aktivitäten im Freien zu reduzieren.';
    } else if (co2 >= 1000) {
        valueDescription = 'Die CO2-Werte in Innenräumen sind hoch. Es wird empfohlen, regelmäßig zu lüften.';
    } else if (solar < 100) {
        valueDescription = 'Die Solarstromproduktion ist heute geringer. Dies könnte an bewölktem Wetter liegen.';
    } else {
        valueDescription = 'Die Bedingungen sind heute stabil.';
    }
            // Insert description under each section
            document.querySelector('#luftqualität .description').textContent = valueDescription;
            document.querySelector('#co2 .description').textContent = valueDescription;
            document.querySelector('#solar .description').textContent = valueDescription;
        };

// Initialize fetching of data
async function initialize() {
    await fetchLuftqualität();
    await fetchCO2();
    await fetchSolar();
    await createCombinedChart(); // Create the combined chart after fetching data
}

// Call initialize to start the process
initialize();
