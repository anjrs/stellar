<?php
// === CONFIGURATION === //
$host = 'localhost';
$db   = 'dolibarr';        // Replace with your Dolibarr DB name
$user = 'root';            // Replace with your MySQL username
$pass = 'base';                // Replace with your MySQL password
$charset = 'utf8mb4';

// === SETUP CONNECTION === //
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Disable foreign key checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    $tables = [
        'llx_societe',
        'llx_socpeople',
        'llx_categorie',
        'llx_categorie_societe',
        'llx_categorie_product',
        'llx_product',
        'llx_propal',
        'llx_propaldet',
        'llx_commande',
        'llx_commandedet',
        'llx_facture',
        'llx_facturedet',
        'llx_paiement',
        'llx_paiement_facture',
        'llx_expedition',
        'llx_expeditiondet',
    ];

    foreach ($tables as $table) {
        $pdo->exec("TRUNCATE TABLE `$table`");
        echo "✅ Truncated: $table<br>";
    }

    // Re-enable foreign key checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "<br>🧹 Done! Dolibarr data has been reset.";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>

