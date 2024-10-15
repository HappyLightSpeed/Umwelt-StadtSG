// Function to fetch and handle data from all APIs
async function fetchData() {
    try {
        // Fetch data from all three APIs simultaneously
        const [stromRes, co2Res, airRes] = await Promise.all([
            fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadStrom.php'),
            fetch('https://etl.mmp.li/Umwelt_St_Gallen/etl/unloadCo2.php'),
            fetch('https://etl.mmp.li/Umwelt_St_Gallen/etl/unloadAirQuality.php')
        ]);

        // Parse the JSON responses
        const [stromData, co2Data, airData] = await Promise.all([
            stromRes.json(),
            co2Res.json(),
            airRes.json()
        ]);

        // Update UI with latest values
        updateAirQuality(airData);
        updateCO2(co2Data);
        updateSolar(stromData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update Luftqualität section with the most recent value and chart
function updateAirQuality(airData) {
    const latestValue = airData[airData.length - 1].pm10; // Get most recent PM10 value
    document.getElementById('pm10').innerText = `${latestValue} µg/m³`;

    const dailyData = groupByDay(airData, 'pm10');
    const labels = Object.keys(dailyData);
    const data = Object.values(dailyData);

    const ctx = document.getElementById('chartLuftqualität').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feinstaub (PM10) µg/m³',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'PM10 µg/m³'
                    }
                }
            }
        }
    });
}

// Function to update CO2 section with the most recent value and chart
function updateCO2(co2Data) {
    const latestValue = co2Data[co2Data.length - 1].co2_wert; // Get most recent CO2 value
    document.getElementById('co2-value').innerText = `${latestValue} ppm`;

    const dailyData = groupByDay(co2Data, 'co2_wert');
    const labels = Object.keys(dailyData);
    const data = Object.values(dailyData);

    const ctx = document.getElementById('chartCO2').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO2 Konzentration (ppm)',
                data: data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'CO2 ppm'
                    }
                }
            }
        }
    });
}

// Function to update Solarstromproduktion section with the most recent value and chart
function updateSolar(stromData) {
    const latestValue = stromData[stromData.length - 1].stromproduktion; // Get most recent strom value
    document.getElementById('solar-value').innerText = `${latestValue} kWh`;

    const dailyData = groupByDay(stromData, 'stromproduktion');
    const labels = Object.keys(dailyData);
    const data = Object.values(dailyData);

    const ctx = document.getElementById('chartSolar').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Solarstromproduktion (kWh)',
                data: data,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
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
}

// Helper function to group data by day and calculate the average for each day
function groupByDay(data, valueKey) {
    const grouped = {};

    data.forEach(item => {
        const date = new Date(item.time).toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        if (!grouped[date]) {
            grouped[date] = { sum: 0, count: 0 };
        }
        grouped[date].sum += item[valueKey];
        grouped[date].count += 1;
    });

    // Calculate average for each day
    const dailyData = {};
    for (const date in grouped) {
        dailyData[date] = (grouped[date].sum / grouped[date].count).toFixed(2); // Average with 2 decimals
    }

    return dailyData;
}

// Call the fetchData function when the page loads
window.onload = fetchData;
