document.addEventListener("DOMContentLoaded", function() {
    // Beispiel-Daten
    const luftqualität = {
        pm10: 40
    };

    const co2Daten = {
        co2: 850
    };

    const solarDaten = {
        solar: 120
    };

    // Werte animiert anzeigen
    document.getElementById('pm10').textContent = luftqualität.pm10;
    document.getElementById('co2-value').textContent = co2Daten.co2;
    document.getElementById('solar-value').textContent = solarDaten.solar;

    // Dynamisches Fazit basierend auf den Werten
    const pm10 = luftqualität.pm10;
    const co2 = co2Daten.co2;
    const solar = solarDaten.solar;

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

    // Diagramm der letzten Woche
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mo', 'Di', Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{
                label: 'Feinstaub (PM10) µg/m³',
                data: [42, 35, 38, 40, 33, 30, 45],
                borderColor: 'rgba(255, 99, 132, 1)',
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
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
