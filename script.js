// Utility function to extract the date only (YYYY-MM-DD) from the timestamp
function formatDate(timeString) {
    return new Date(timeString).toISOString().split('T')[0];
}

// Fetch and display data for Luftqualität (PM10)
async function fetchLuftqualität() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadAirQuality.php');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const latestValue = data[0]?.pm10_wert || 'N/A'; // Avoid undefined values
        document.getElementById('pm10').innerText = `${latestValue} µg/m³`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const pm10Values = data.map(entry => entry.pm10_wert || 0); // Avoid undefined values

        return { labels, pm10Values };
    } catch (error) {
        console.error('Error fetching Luftqualität data:', error);
    }
}

// Fetch and display data for CO2
async function fetchCO2() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadCo2.php');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const latestValue = data[0]?.co2_wert || 'N/A'; // Avoid undefined values
        document.getElementById('co2-value').innerText = `${latestValue} ppm`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const co2Values = data.map(entry => entry.co2_wert || 0);

        return { labels, co2Values };
    } catch (error) {
        console.error('Error fetching CO2 data:', error);
    }
}

// Fetch and display data for Solarstromproduktion
async function fetchSolar() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadStrom.php');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const latestValue = data[0]?.stromproduktion || 'N/A'; // Avoid undefined values
        document.getElementById('solar-value').innerText = `${latestValue} kWh`;

        // Prepare data for the chart
        const labels = data.map(entry => formatDate(entry.time));
        const solarValues = data.map(entry => entry.stromproduktion || 0);

        return { labels, solarValues };
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

        if (!luftData || !co2Data || !solarData) {
            throw new Error('Missing data to create chart');
        }

        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last7Days.push(formatDate(date));
        }

        // Prepare data for the last 7 days
        const pm10Values = last7Days.map(date => luftData.pm10Values[luftData.labels.indexOf(date)] || 0);
        const co2Values = last7Days.map(date => co2Data.co2Values[co2Data.labels.indexOf(date)] || 0);
        const solarValues = last7Days.map(date => solarData.solarValues[solarData.labels.indexOf(date)] || 0);

        // Create the combined chart
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
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
    document.querySelector('#luftqualität .description').textContent = valueDescription;
    document.querySelector('#co2 .description').textContent = valueDescription;
    document.querySelector('#solar .description').textContent = valueDescription;
}

// Initialize fetching of data
async function initialize() {
    try {
        await fetchLuftqualität();
        await fetchCO2();
        await fetchSolar();
        await createCombinedChart();
    } catch (error) {
        console.error('Error initializing data fetching:', error);
    }
}

// Call initialize to start the process
initialize();
