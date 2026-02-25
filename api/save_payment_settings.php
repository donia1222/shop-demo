<?php
require_once 'config.php';
setCORSHeaders();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit(); }

try {
    $pdo  = getDBConnection();
    $body = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("INSERT INTO payment_settings
        (id, paypal_email, stripe_publishable_key, stripe_secret_key, twint_phone,
         bank_iban, bank_holder, bank_name,
         enable_paypal, enable_stripe, enable_twint, enable_invoice)
        VALUES (1, :paypal_email, :stripe_publishable_key, :stripe_secret_key, :twint_phone,
                :bank_iban, :bank_holder, :bank_name,
                :enable_paypal, :enable_stripe, :enable_twint, :enable_invoice)
        ON DUPLICATE KEY UPDATE
            paypal_email           = VALUES(paypal_email),
            stripe_publishable_key = VALUES(stripe_publishable_key),
            stripe_secret_key      = VALUES(stripe_secret_key),
            twint_phone            = VALUES(twint_phone),
            bank_iban              = VALUES(bank_iban),
            bank_holder            = VALUES(bank_holder),
            bank_name              = VALUES(bank_name),
            enable_paypal          = VALUES(enable_paypal),
            enable_stripe          = VALUES(enable_stripe),
            enable_twint           = VALUES(enable_twint),
            enable_invoice         = VALUES(enable_invoice)");

    $stmt->execute([
        ':paypal_email'           => trim($body['paypal_email'] ?? ''),
        ':stripe_publishable_key' => trim($body['stripe_publishable_key'] ?? ''),
        ':stripe_secret_key'      => trim($body['stripe_secret_key'] ?? ''),
        ':twint_phone'            => trim($body['twint_phone'] ?? ''),
        ':bank_iban'              => trim($body['bank_iban'] ?? ''),
        ':bank_holder'            => trim($body['bank_holder'] ?? ''),
        ':bank_name'              => trim($body['bank_name'] ?? ''),
        ':enable_paypal'          => (int)(bool)($body['enable_paypal']  ?? false),
        ':enable_stripe'          => (int)(bool)($body['enable_stripe']  ?? false),
        ':enable_twint'           => (int)(bool)($body['enable_twint']   ?? false),
        ':enable_invoice'         => (int)(bool)($body['enable_invoice'] ?? true),
    ]);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
