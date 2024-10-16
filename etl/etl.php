<?php
// Include the config file
require "config.php";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to fetch data from an API
function fetchData($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Get HTTP response code
    curl_close($ch);
    
    // Log response for debugging
    if ($httpCode !== 200) {
        echo "Error fetching data from {$url}. HTTP Code: {$httpCode}\n";
        return null; // Return null on error
    }

    return json_decode($response, true);
}

// Fetch data from all 3 APIs
$luftqualitaetData = fetchData("https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/luftwerte-stadt-stgallen/records");
$co2Data = fetchData("https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/co2-sensoren-innenraume-stadt-stgallen/records");
$solarstromData = fetchData("https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/aktuelle-stromproduktion-der-solaranlagen-der-stgaller-stadtwerke/records");

// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Prepare SQL statement for inserting into the table
$sql = "INSERT INTO Umwelt_Stadt_St_Gallen (description, time, luftqualitaet, co2_wert, stromproduktion) 
        VALUES (:description, :time, :luftqualitaet, :co2_wert, :stromproduktion)";
$stmt = $pdo->prepare($sql);

// Helper function to insert data into the database
function insertData($stmt, $description, $time, $luftqualitaet, $co2Wert, $stromproduktion) {
    $stmt->execute([
        ':description' => $description,
        ':time' => $time,
        ':luftqualitaet' => $luftqualitaet,
        ':co2_wert' => $co2Wert,
        ':stromproduktion' => $stromproduktion
    ]);
}

// Insert Luftqualität data
if (isset($luftqualitaetData['results']) && is_array($luftqualitaetData['results'])) {
    foreach ($luftqualitaetData['results'] as $luftRecord) {
        $description = 'Luftqualität';
        $time = $luftRecord['measured_at_new'];
        
        // Decode the JSON stored in the 'data' field
        $data = json_decode($luftRecord['data'], true);
        $luftqualitaet = $data['air_temperature'] ?? $data['temperature'] ?? null; // Check for both keys
        
        insertData($stmt, $description, $time, $luftqualitaet, null, null);
    }
} else {
    echo "Luftqualität data not available or malformed.\n";
    // Log the raw response for debugging
    var_dump($luftqualitaetData);
}

// Insert CO2 data
if (isset($co2Data['results']) && is_array($co2Data['results'])) {
    foreach ($co2Data['results'] as $co2Record) {
        $description = 'CO2 Sensoren';
        $time = $co2Record['measured_at_new'];
        
        // Decode the JSON stored in the 'data' field to access CO2 value
        $data = json_decode($co2Record['data'], true);
        $co2Wert = $data['co2'] ?? null; // Accessing the co2 key
        
        insertData($stmt, $description, $time, null, $co2Wert, null);
    }
} else {
    echo "CO2 data not available or malformed.\n";
    // Log the raw response for debugging
    var_dump($co2Data);
}

// Insert Solarstrom data
if (isset($solarstromData['results']) && is_array($solarstromData['results'])) {
    foreach ($solarstromData['results'] as $solarRecord) {
        $description = 'Solarstrom';
        $time = $solarRecord['valuedate']; // Correct key for timestamp
        $stromproduktion = $solarRecord['activepower'] ?? null; // Correct key for production
        
        insertData($stmt, $description, $time, null, null, $stromproduktion);
    }
} else {
    echo "Solarstrom data not available or malformed.\n";
    // Log the raw response for debugging
    var_dump($solarstromData);
}

echo "Data successfully inserted into the database.";
?>