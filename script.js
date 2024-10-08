document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from the provided API
    fetch('https://etl.mmp.li/Umwelt_Stadt_St_Gallen/etl/unload.php')
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns an array of records
            const luftData = data.find(record => record.description === 'Luftqualität');
            const co2Data = data.find(record => record.description === 'CO2 Sensoren');
            const solarData = data.find(record => record.description === 'Solarstrom');

            // If data is available, update the DOM with fetched data
            if (luftData) {
                document.getElementById('pm10').textContent = luftData.luftqualitaet || 'N/A';
            }

            if (co2Data) {
                document.getElementById('co2-value').textContent = co2Data.co2_wert || 'N/A';
            }

            if (solarData) {
                document.getElementById('solar-value').textContent = solarData.stromproduktion || 'N/A';
            }

            // Dynamically update the conclusion (Fazit) based on the fetched data
            const pm10 = parseFloat(luftData.luftqualitaet || 0);
            const co2 = parseFloat(co2Data.co2_wert || 0);
            const solar = parseFloat(solarData.stromproduktion || 0);

            let fazitText = '';

            if (pm10 < 50 && co2 < 1000 && solar > 100) {
                fazitText = 'Die Umweltbedingungen sind heute gut. Die Luftqualität ist hervorragend, CO2-Konzentrationen sind niedrig und die Solaranlagen produzieren viel Strom.';
            } else if (pm10 >= 50) {
                fazitText = 'Die Feinstaubbelastung ist höher als normal. Es wird empfohlen, Aktivitäten im Freien zu reduzieren.';
            } else if (co2 >= 1000) {
                fazitText = 'Die CO2-Werte in Innenräumen sind hoch. Es wird empfohlen, regelmäßig zu lüften.';
            } else if (solar < 100) {
                fazitText = 'Die Solarstromproduktion ist heute geringer. Dies könnte an bewölktem Wetter liegen.';
            } else {
                fazitText = 'Die Bedingungen sind heute stabil.';
            }

            document.getElementById('fazit-text').textContent = fazitText;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('fazit-text').textContent = 'Daten konnten nicht abgerufen werden.';
        });

    // Chart for Luftqualität
    const ctxLuft = document.getElementById('chartLuftqualität').getContext('2d');
    new Chart(ctxLuft, {
        type: 'line',
        data: {
            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{
                label: 'Feinstaub (PM10) µg/m³',
                data: [42, 35, 38, 40, 33, 30, 45],
                borderColor: 'rgba(224, 0, 37, 1)',
                borderWidth: 2,
                fill: false
            }]
        }
    });

    // Chart for CO2
    const ctxCO2 = document.getElementById('chartCO2').getContext('2d');
    new Chart(ctxCO2, {
        type: 'line',
        data: {
            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{
                label: 'CO2 (ppm)',
                data: [850, 870, 860, 840, 830, 820, 810],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false
            }]
        }
    });

    // Chart for Solarproduktion
    const ctxSolar = document.getElementById('chartSolar').getContext('2d');
    new Chart(ctxSolar, {
        type: 'line',
        data: {
            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{
                label: 'Solarstromproduktion (kWh)',
                data: [110, 90, 130, 120, 150, 140, 160],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        }
    });

    // Chart for the last week
    const ctxWeekly = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctxWeekly, {
        type: 'line',
        data: {
            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{
                label: 'Feinstaub (PM10) µg/m³',
                data: [42, 35, 38, 40, 33, 30, 45],
                borderColor: 'rgba(224, 0, 37, 1)',
                borderWidth: 2,
                fill: false
            }, {
                label: 'CO2 (ppm)',
                data: [850, 870, 860, 840, 830, 820, 810],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Solarstromproduktion (kWh)',
                data: [110, 90, 130, 120, 150, 140, 160],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        }
    });
});
