<?php
    $datenbank = connect_to_database('db_lea', 'lea', 'asdfjklö');
    $daten = $datenbank.sql('SELECT * FROM Posts');
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello <?php echo 4 + 9 ?></h1>
</body>
</html>