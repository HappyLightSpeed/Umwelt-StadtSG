<?php

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Establish database connection
    $pdo = new PDO($dsn, $username, $password, $options);

    // Prepare SQL query to retrieve data from the "Umwelt_Stadt_St_Gallen" table
    $stmt = $pdo->prepare("
        SELECT time, stromproduktion
        FROM Umwelt_Stadt_St_Gallen 
        WHERE stromproduktion IS NOT NULL
        ORDER BY time DESC
        LIMIT 100
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

