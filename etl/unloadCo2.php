<?php

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Establish database connection
    $pdo = new PDO($dsn, $username, $password, $options);

    // Prepare SQL query to retrieve data from the "Umwelt_Stadt_St_Gallen" table
    $stmt = $pdo->prepare("
        SELECT co2_wert, time
        FROM Umwelt_Stadt_St_Gallen 
        WHERE co2_wert IS NOT NULL
            AND DATE(time) = '2024-07-02'
        LIMIT 17
    ");

    // Execute the query without binding any parameters
    $stmt->execute();

    // Fetch all results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return results as JSON
    echo json_encode($results);

} catch (PDOException $e) {
    // Return error message in case of failure
    echo json_encode(['error' => $e->getMessage()]);
}

