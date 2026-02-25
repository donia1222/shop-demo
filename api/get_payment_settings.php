<?php
require_once 'config.php';
setCORSHeaders();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

try {
    $pdo = getDBConnection();

    // Auto-migration: create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS payment_settings (
        id INT NOT NULL DEFAULT 1,
        paypal_email VARCHAR(255) NOT NULL DEFAULT '',
        stripe_secret_key VARCHAR(255) NOT NULL DEFAULT '',
        stripe_publishable_key VARCHAR(255) NOT NULL DEFAULT '',
        stripe_webhook_secret VARCHAR(255) NOT NULL DEFAULT '',
        twint_phone VARCHAR(50) NOT NULL DEFAULT '',
        bank_iban VARCHAR(50) NOT NULL DEFAULT '',
        bank_holder VARCHAR(255) NOT NULL DEFAULT '',
        bank_name VARCHAR(255) NOT NULL DEFAULT '',
        enable_paypal TINYINT(1) NOT NULL DEFAULT 0,
        enable_stripe TINYINT(1) NOT NULL DEFAULT 0,
        enable_twint TINYINT(1) NOT NULL DEFAULT 0,
        enable_invoice TINYINT(1) NOT NULL DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Safe column migrations
    $cols = ['paypal_email','stripe_secret_key','stripe_publishable_key','stripe_webhook_secret',
             'twint_phone','bank_iban','bank_holder','bank_name',
             'enable_paypal','enable_stripe','enable_twint','enable_invoice'];
    foreach ($cols as $col) {
        try { $pdo->exec("ALTER TABLE payment_settings ADD COLUMN $col VARCHAR(255) NOT NULL DEFAULT ''"); } catch (Exception $e) {}
    }

    // Insert default row if empty
    if ($pdo->query("SELECT COUNT(*) FROM payment_settings")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO payment_settings (id, enable_invoice) VALUES (1, 1)");
    }

    $row = $pdo->query("SELECT * FROM payment_settings WHERE id = 1")->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'settings' => [
            'paypal_email'           => $row['paypal_email'] ?? '',
            'stripe_publishable_key' => $row['stripe_publishable_key'] ?? '',
            'stripe_secret_key'      => $row['stripe_secret_key'] ?? '',
            'twint_phone'            => $row['twint_phone'] ?? '',
            'bank_iban'              => $row['bank_iban'] ?? '',
            'bank_holder'            => $row['bank_holder'] ?? '',
            'bank_name'              => $row['bank_name'] ?? '',
            'enable_paypal'          => (bool)($row['enable_paypal'] ?? 0),
            'enable_stripe'          => (bool)($row['enable_stripe'] ?? 0),
            'enable_twint'           => (bool)($row['enable_twint'] ?? 0),
            'enable_invoice'         => (bool)($row['enable_invoice'] ?? 1),
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
