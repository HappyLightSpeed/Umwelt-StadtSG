// Utility function to extract the date only (YYYY-MM-DD) from the timestamp
function formatDate(timeString) {
    return new Date(timeString).toISOString().split('T')[0];
}

// Funktion zur Generierung von Erklärungstexten basierend auf den Werten
function generateDescriptions(pm10, co2, solar) {
    let pm10Description;
    let co2Description;
    let solarDescription;

    // PM10 Beschreibung
    if (pm10 < 20) {
        pm10Description = "Die PM10-Werte sind gut und zeigen eine gesunde Luftqualität an.";
    } else if (pm10 < 50) {
        pm10Description = "Die PM10-Werte sind moderat. Achte auf die Luftqualität bei längerem Aufenthalt im Freien.";
    } else {
        pm10Description = "Die PM10-Werte sind hoch und können gesundheitliche Risiken darstellen. Vermeide längere Aufenthalte im Freien.";
    }

    // CO2 Beschreibung
    if (co2 < 400) {
        co2Description = "Die CO2-Konzentration ist optimal für Innenräume. Gute Belüftung ist gewährleistet.";
    } else if (co2 < 1000) {
        co2Description = "Die CO2-Konzentration ist akzeptabel, aber eine bessere Belüftung könnte nötig sein.";
    } else {
        co2Description = "Die CO2-Werte sind hoch und können zu Konzentrationsproblemen führen. Eine sofortige Verbesserung der Belüftung wird empfohlen.";
    }

    // Solar Beschreibung
    if (solar > 50) {
        solarDescription = "Die Solarstromproduktion ist hervorragend und trägt erheblich zur Reduzierung des CO2-Ausstoßes bei.";
    } else if (solar > 20) {
        solarDescription = "Die Solarstromproduktion ist durchschnittlich. Weiterhin auf eine optimale Ausnutzung der Sonnenstunden achten.";
    } else {
        solarDescription = "Die Solarstromproduktion ist niedrig. Überlege, wie du die Effizienz der Solaranlagen steigern kannst.";
    }

    return {
        pm10Description,
        co2Description,
        solarDescription
    };
}

// Fetch and display data for Luftqualität (PM10)
async function fetchLuftqualität() {
    try {
        const response = await fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unloadAirQuality.php');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Use the latest value or fallback to 0
        const latestValue = data[0]?.pm10_wert ?? data[1]?.pm10_wert ?? 0; 
        document.getElementById('pm10').innerText = `${latestValue} µg/m³`;

        // Prepare data for the chart
        const labels = data.slice(0, 7).map(entry => formatDate(entry.time)); // Last 7 days
        const pm10Values = data.slice(0, 7).map(entry => entry.pm10_wert ?? 0);

        // Generate PM10 description
        const descriptions = generateDescriptions(latestValue, null, null);
        document.getElementById('pm10-description').innerText = descriptions.pm10Description;

        // Create individual PM10 chart
        const pm10Ctx = document.getElementById('pm10Chart').getContext('2d');
        new Chart(pm10Ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'PM10 Feinstaub (µg/m³)',
                    data: pm10Values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
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
                            text: 'PM10-Wert (µg/m³)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        return { latestValue, labels, pm10Values };
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

        // Use the latest value or fallback to 0
        const latestValue = data[0]?.co2_wert ?? data[1]?.co2_wert ?? 0;
        document.getElementById('co2-value').innerText = `${latestValue} ppm`;

        // Prepare data for the chart
        const labels = data.slice(0, 7).map(entry => formatDate(entry.time)); // Last 7 days
        const co2Values = data.slice(0, 7).map(entry => entry.co2_wert ?? 0);

        // Generate CO2 description
        const descriptions = generateDescriptions(null, latestValue, null);
        document.getElementById('co2-description').innerText = descriptions.co2Description;

        // Create individual CO2 chart
        const co2Ctx = document.getElementById('co2Chart').getContext('2d');
        new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'CO2-Konzentration (ppm)',
                    data: co2Values,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
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
                            text: 'CO2-Wert (ppm)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        return { latestValue, labels, co2Values };
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

        // Use the latest value or fallback to 0
        const latestValue = data[0]?.stromproduktion ?? data[1]?.stromproduktion ?? 0;
        document.getElementById('solar-value').innerText = `${latestValue} kWh`;

        // Prepare data for the chart
        const labels = data.slice(0, 7).map(entry => formatDate(entry.time)); // Last 7 days
        const solarValues = data.slice(0, 7).map(entry => entry.stromproduktion ?? 0);

        // Generate Solar description
        const descriptions = generateDescriptions(null, null, latestValue);
        document.getElementById('solar-description').innerText = descriptions.solarDescription;

        // Create individual Solar chart
        const solarCtx = document.getElementById('solarChart').getContext('2d');
        new Chart(solarCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Solarstromproduktion (kWh)',
                    data: solarValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
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
                            text: 'Stromproduktion (kWh)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });

        return { latestValue, labels, solarValues };
    } catch (error) {
        console.error('Error fetching Solarstromproduktion data:', error);
    }
}

// Create a combined chart for the last week using the same data from individual charts
async function createCombinedChart() {
    try {
        const luftData = await fetchLuftqualität();
        const co2Data = await fetchCO2();
        const solarData = await fetchSolar();

        if (!luftData || !co2Data || !solarData) {
            throw new Error('Missing data to create chart');
        }

        // Reuse labels (date) from Luftqualität data (assuming all datasets have the same labels)
        const labels = luftData.labels;

        // Create the combined chart
        const combinedCtx = document.getElementById('combinedChart').getContext('2d');
        new Chart(combinedCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'PM10 (µg/m³)',
                        data: luftData.pm10Values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'CO2 (ppm)',
                        data: co2Data.co2Values,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Solarstromproduktion (kWh)',
                        data: solarData.solarValues,
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
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating combined chart:', error);
    }
}

// Start all fetch functions and create charts
async function initialize() {
    await Promise.all([fetchLuftqualität(), fetchCO2(), fetchSolar()]);
    await createCombinedChart();
}

initialize();
