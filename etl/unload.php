<?php

require_once 'config.php';

header('Content-Type: application/json');

// Set default limit if not specified
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

try {
    // Establish database connection
    $pdo = new PDO($dsn, $username, $password, $options);

    // Prepare SQL query to retrieve data from the "Umwelt_Stadt_St_Gallen" table
    $stmt = $pdo->prepare("
        SELECT description, time, luftqualitaet, co2_wert, stromproduktion 
        FROM Umwelt_Stadt_St_Gallen 
        ORDER BY time DESC 
        LIMIT :limit
    ");
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch all results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return results as JSON
    echo json_encode($results);

} catch (PDOException $e) {
    // Return error message in case of failure
    echo json_encode(['error' => $e->getMessage()]);
}
?>
