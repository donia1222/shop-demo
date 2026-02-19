<?php
/**
 * Funciones para gestión de emails de confirmación
 * Separado del archivo principal para mejor organización
 */

// Función para enviar email de confirmación de factura
function sendInvoiceConfirmationEmail($data) {
    $customerInfo = $data['customerInfo'];
    $billingAddress = $data['billingAddress'] ?? null;
    $cart = $data['cart'];
    $total = $data['total'];
    $orderNumber = $data['orderNumber'];
    
    // Configuración de emails
    $toStore = 'info@lweb.ch';
    $toCustomer = $customerInfo['email'];
    $fromEmail = 'info@cantinatexmex.ch';
    
    // ===== EMAIL PARA LA TIENDA (Factura) =====
    $storeSubject = '🧾 NUEVA ORDEN FACTURA - Salsas.ch - ' . $orderNumber;
    $storeEmailContent = generateStoreInvoiceEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber);
    
    // ===== EMAIL PARA EL CLIENTE (Factura) =====
    $customerSubject = '📄 Bestellbestätigung - Rechnung - Salsas.ch';
    $customerEmailContent = generateCustomerInvoiceEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber);
    
    // Headers para emails HTML
    $storeHeaders = "MIME-Version: 1.0\r\n";
    $storeHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $storeHeaders .= "From: {$fromEmail}\r\n";
    $storeHeaders .= "Reply-To: {$customerInfo['email']}\r\n";
    
    $customerHeaders = "MIME-Version: 1.0\r\n";
    $customerHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $customerHeaders .= "From: {$fromEmail}\r\n";
    $customerHeaders .= "Reply-To: {$fromEmail}\r\n";
    
    // Enviar emails
    $storeEmailSent = mail($toStore, $storeSubject, $storeEmailContent, $storeHeaders);
    $customerEmailSent = mail($toCustomer, $customerSubject, $customerEmailContent, $customerHeaders);
    
    return [
        'success' => ($storeEmailSent && $customerEmailSent),
        'storeEmailSent' => $storeEmailSent,
        'customerEmailSent' => $customerEmailSent
    ];
}

function generateStoreInvoiceEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber) {
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    
    $content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .urgent { background-color: #fef3c7; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #f59e0b; }
            .order-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .customer-info { background-color: #e7f3ff; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #16a34a; }
            .next-steps { background-color: #dcfce7; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>📄 NEUE RECHNUNG - Salsas.ch</h1>
            <p>Kauf auf Rechnung - Rechnung per Post senden!</p>
        </div>
        
        <div class='content'>
            <div class='urgent'>
                <h2>📄 RECHNUNG ERSTELLEN UND VERSENDEN</h2>
                <p><strong>Neue Bestellung mit Kauf auf Rechnung</strong></p>
                <p>Bestellnummer: <strong>{$orderNumber}</strong></p>
                <p><strong>⚠️ WICHTIG: Rechnung per Post an Kunde senden!</strong></p>
            </div>

            <div class='order-details'>
                <h2>💳 Zahlungsdetails</h2>
                <p><strong>Zahlungsart:</strong> Kauf auf Rechnung</p>
                <p><strong>Bestellnummer:</strong> {$orderNumber}</p>
                <p><strong>Datum:</strong> " . date('d.m.Y H:i') . "</p>
                <p><strong>Status:</strong> 📄 RECHNUNG ERFORDERLICH</p>
                <p><strong>Betrag:</strong> <span class='total'>{$total} CHF</span></p>
                <p><strong>Zahlungsziel:</strong> 30 Tage ab Rechnungsdatum</p>
            </div>

            <div class='customer-info'>
                <h2>👤 Kundeninformationen</h2>
                <p><strong>Name:</strong> {$customerInfo['firstName']} {$customerInfo['lastName']}</p>
                <p><strong>E-Mail:</strong> {$customerInfo['email']}</p>
                <p><strong>Telefon:</strong> {$customerInfo['phone']}</p>
                <h3>📮 Lieferadresse:</h3>
                <p><strong>{$customerInfo['firstName']} {$customerInfo['lastName']}</strong></p>
                <p>{$customerInfo['address']}</p>
                <p>{$customerInfo['postalCode']} {$customerInfo['city']}</p>
                <p><strong>Kanton:</strong> {$customerInfo['canton']}</p>";
    
    // Agregar dirección de facturación si es diferente
    if ($billingAddress) {
        $content .= "
                <h3>💳 Rechnungsadresse (ANDERS ALS LIEFERADRESSE):</h3>
                <p style='background-color: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b;'>
                    <strong>⚠️ WICHTIG: Rechnung an andere Adresse senden!</strong>
                </p>
                <p><strong>{$billingAddress['firstName']} {$billingAddress['lastName']}</strong></p>
                <p>{$billingAddress['address']}</p>
                <p>{$billingAddress['postalCode']} {$billingAddress['city']}</p>
                <p><strong>Kanton:</strong> {$billingAddress['canton']}</p>";
    } else {
        $content .= "
                <h3>💳 Rechnungsadresse:</h3>
                <p><em>Gleich wie Lieferadresse</em></p>";
    }
    
    $content .= "";
    
    if (!empty($customerInfo['notes'])) {
        $content .= "<p><strong>⚠️ Besondere Hinweise:</strong> {$customerInfo['notes']}</p>";
    }
    
    $content .= "
            </div>

            <div class='order-details'>
                <h2>🛒 Zu versendende Produkte</h2>";
    
    foreach ($cart as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $content .= "
                <div class='product-item'>
                    <p><strong>{$item['name']}</strong></p>
                    <p>Menge: <strong>{$item['quantity']}</strong> x {$item['price']} CHF = <strong>{$itemTotal} CHF</strong></p>
                    <p><em>{$item['description']}</em></p>
                </div>";
    }
    
    $content .= "
                <div style='margin-top: 20px; padding-top: 15px; border-top: 2px solid #16a34a;'>
                    <p><strong>Zwischensumme:</strong> {$subtotal} CHF</p>
                    <p><strong>Versand:</strong> Kostenlos</p>
                    <p class='total'>GESAMT: {$total} CHF</p>
                </div>
            </div>

            <div class='next-steps'>
                <h3>📄 Nächste Schritte - RECHNUNG</h3>
                <p>📋 1. Bestellung bearbeiten und Versand vorbereiten</p>
                <p>📄 2. RECHNUNG ERSTELLEN mit 30 Tagen Zahlungsziel</p>
                <p>📮 3. Rechnung per Post senden an:</p>
                <p style='margin-left: 20px;'><strong>{$customerInfo['firstName']} {$customerInfo['lastName']}</strong><br>
                   {$customerInfo['address']}<br>
                   {$customerInfo['postalCode']} {$customerInfo['city']}</p>
                <p>📦 4. Ware nach Zahlungseingang oder mit Rechnung versenden</p>
                <p>📧 5. Tracking-Nummer an Kunde senden: {$customerInfo['email']}</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $content;
}

function generateCustomerInvoiceEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber) {
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    
    $content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .thank-you { background-color: #dcfce7; padding: 20px; margin: 15px 0; border-radius: 5px; text-align: center; }
            .order-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #16a34a; }
            .invoice-info { background-color: #fef3c7; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>📄 Salsas.ch</h1>
            <p>Bestellbestätigung - Kauf auf Rechnung</p>
        </div>
        
        <div class='content'>
            <div class='thank-you'>
                <h2>✅ Bestellung bestätigt!</h2>
                <p>Liebe/r {$customerInfo['firstName']},</p>
                <p>Vielen Dank für Ihre Bestellung bei Salsas.ch! Ihre Bestellung wurde erfolgreich aufgenommen.</p>
            </div>

            <div class='order-details'>
                <h2>📋 Ihre Bestelldetails</h2>
                <p><strong>Bestellnummer:</strong> {$orderNumber}</p>
                <p><strong>Datum:</strong> " . date('d.m.Y H:i') . "</p>
                <p><strong>Zahlungsart:</strong> 📄 Kauf auf Rechnung</p>
                <p><strong>Status:</strong> ✅ Bestätigt</p>
            </div>

            <div class='invoice-info'>
                <h3>📄 Kauf auf Rechnung - Wichtige Informationen</h3>
                <ul>
                    <li><strong>Die Rechnung wird Ihnen per Post zugesendet</strong></li>
                    <li>Zahlungsziel: 30 Tage ab Rechnungsdatum</li>
                    <li>Zahlung per Überweisung auf unser Bankkonto</li>
                    <li>Die Ware wird zeitnah nach Ihrer Bestellung versendet</li>
                </ul>
            </div>

            <div class='order-details'>
                <h2>🛒 Bestellte Produkte</h2>";
    
    foreach ($cart as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $content .= "
                <div class='product-item'>
                    <p><strong>{$item['name']}</strong></p>
                    <p>Menge: {$item['quantity']} x {$item['price']} CHF = {$itemTotal} CHF</p>
                    <p><em>{$item['description']}</em></p>
                </div>";
    }
    
    $content .= "
                <div style='margin-top: 20px; padding-top: 15px; border-top: 2px solid #16a34a;'>
                    <p><strong>Zwischensumme:</strong> {$subtotal} CHF</p>
                    <p><strong>Versand:</strong> Kostenlos</p>
                    <p class='total'>GESAMT: {$total} CHF</p>
                </div>
            </div>

            <div class='order-details'>
                <h2>📮 Lieferadresse</h2>
                <p><strong>{$customerInfo['firstName']} {$customerInfo['lastName']}</strong></p>
                <p>{$customerInfo['address']}</p>
                <p>{$customerInfo['postalCode']} {$customerInfo['city']}</p>
                <p>{$customerInfo['canton']}</p>
            </div>";
    
    // Agregar dirección de facturación si es diferente
    if ($billingAddress) {
        $content .= "
            <div class='order-details'>
                <h2>💳 Rechnungsadresse</h2>
                <div style='background-color: #fef3c7; padding: 15px; margin-bottom: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;'>
                    <p><strong>Die Rechnung wird an diese abweichende Adresse gesendet:</strong></p>
                </div>
                <p><strong>{$billingAddress['firstName']} {$billingAddress['lastName']}</strong></p>
                <p>{$billingAddress['address']}</p>
                <p>{$billingAddress['postalCode']} {$billingAddress['city']}</p>
                <p>{$billingAddress['canton']}</p>
            </div>";
    }
    
    $content .= "

            <div class='invoice-info'>
                <h3>📦 Was passiert als nächstes?</h3>
                <p>✅ Ihre Bestellung wurde bestätigt</p>
                <p>📄 Wir senden Ihnen die Rechnung per Post</p>
                <p>📦 Ihre Ware wird in 2-3 Werktagen versendet</p>
                <p>💰 Bezahlen Sie bequem per Überweisung (30 Tage Zeit)</p>
                <p>📧 Sie erhalten eine Tracking-Nummer per E-Mail</p>
                <p>📞 Bei Fragen: info@cantinatexmex.ch</p>
            </div>

            <div class='footer'>
                <p><strong>Vielen Dank für Ihr Vertrauen!</strong></p>
                <p>📄 Salsas.ch Team</p>
                <p>info@cantinatexmex.ch</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $content;
}

function sendPayPalConfirmationEmail($data) {
    $customerInfo = $data['customerInfo'];
    $billingAddress = $data['billingAddress'] ?? null;
    $cart = $data['cart'];
    $total = $data['total'];
    $orderNumber = $data['orderNumber'];
    $paypalPayerID = $data['paypalPayerID'];
    
    // Configuración de emails
    $toStore = 'info@lweb.ch';
    $toCustomer = $customerInfo['email'];
    $fromEmail = 'info@cantinatexmex.ch';
    
    // ===== EMAIL PARA LA TIENDA (PayPal) =====
    $storeSubject = '🌶️ NEUE BESTELLUNG - Salsas.ch - PayPal ID: ' . $paypalPayerID;
    $storeEmailContent = generateStorePayPalEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber, $paypalPayerID);
    
    // ===== EMAIL PARA EL CLIENTE (PayPal) =====
    $customerSubject = '🔥 Bestellbestätigung - Salsas.ch';
    $customerEmailContent = generateCustomerPayPalEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber, $paypalPayerID);
    
    // Headers para emails HTML
    $storeHeaders = "MIME-Version: 1.0\r\n";
    $storeHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $storeHeaders .= "From: {$fromEmail}\r\n";
    $storeHeaders .= "Reply-To: {$customerInfo['email']}\r\n";
    
    $customerHeaders = "MIME-Version: 1.0\r\n";
    $customerHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $customerHeaders .= "From: {$fromEmail}\r\n";
    $customerHeaders .= "Reply-To: {$fromEmail}\r\n";
    
    // Enviar emails
    $storeEmailSent = mail($toStore, $storeSubject, $storeEmailContent, $storeHeaders);
    $customerEmailSent = mail($toCustomer, $customerSubject, $customerEmailContent, $customerHeaders);
    
    return [
        'success' => ($storeEmailSent && $customerEmailSent),
        'storeEmailSent' => $storeEmailSent,
        'customerEmailSent' => $customerEmailSent
    ];
}

function generateStorePayPalEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber, $paypalPayerID) {
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    
    $timestamp = date('Y-m-d H:i:s');
    
    $content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .urgent { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107; }
            .order-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .customer-info { background-color: #e7f3ff; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #dc3545; }
            .next-steps { background-color: #d4edda; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>🔥 NEUE BESTELLUNG - Salsas.ch</h1>
            <p>Zahlung erfolgreich über PayPal verarbeitet!</p>
        </div>
        
        <div class='content'>
            <div class='urgent'>
                <h2>⚡ SOFORTIGE BEARBEITUNG ERFORDERLICH</h2>
                <p><strong>Neue Bestellung eingegangen - Sofort bearbeiten</strong></p>
                <p>PayPal ID: <strong>{$paypalPayerID}</strong></p>
            </div>

            <div class='order-details'>
                <h2>💳 Zahlungsdetails</h2>
                <p><strong>PayPal Payer ID:</strong> {$paypalPayerID}</p>
                <p><strong>Bestellnummer:</strong> {$orderNumber}</p>
                <p><strong>Datum und Zeit:</strong> {$timestamp}</p>
                <p><strong>Status:</strong> ✅ BEZAHLT UND BESTÄTIGT</p>
                <p><strong>Bezahlter Betrag:</strong> <span class='total'>{$total} CHF</span></p>
            </div>

            <div class='customer-info'>
                <h2>👤 Kundeninformationen</h2>
                <p><strong>Name:</strong> {$customerInfo['firstName']} {$customerInfo['lastName']}</p>
                <p><strong>E-Mail:</strong> {$customerInfo['email']}</p>
                <p><strong>Telefon:</strong> {$customerInfo['phone']}</p>
                <h3>📮 Lieferadresse:</h3>
                <p>{$customerInfo['address']}</p>
                <p>{$customerInfo['postalCode']} {$customerInfo['city']}</p>
                <p><strong>Kanton:</strong> {$customerInfo['canton']}</p>";
    
    // Agregar dirección de facturación si es diferente
    if ($billingAddress) {
        $content .= "
                <h3>💳 Rechnungsadresse (ANDERS ALS LIEFERADRESSE):</h3>
                <p style='background-color: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b;'>
                    <strong>⚠️ WICHTIG: Rechnung an andere Adresse senden!</strong>
                </p>
                <p><strong>{$billingAddress['firstName']} {$billingAddress['lastName']}</strong></p>
                <p>{$billingAddress['address']}</p>
                <p>{$billingAddress['postalCode']} {$billingAddress['city']}</p>
                <p><strong>Kanton:</strong> {$billingAddress['canton']}</p>";
    } else {
        $content .= "
                <h3>💳 Rechnungsadresse:</h3>
                <p><em>Gleich wie Lieferadresse</em></p>";
    }
    
    if (!empty($customerInfo['notes'])) {
        $content .= "<p><strong>⚠️ Besondere Hinweise:</strong> {$customerInfo['notes']}</p>";
    }
    
    $content .= "
            </div>

            <div class='order-details'>
                <h2>🛒 Zu versendende Produkte</h2>";
    
    foreach ($cart as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $content .= "
                <div class='product-item'>
                    <p><strong>{$item['name']}</strong></p>
                    <p>Menge: <strong>{$item['quantity']}</strong> x {$item['price']} CHF = <strong>{$itemTotal} CHF</strong></p>
                    <p><em>{$item['description']}</em></p>
                </div>";
    }
    
    $content .= "
                <div style='margin-top: 20px; padding-top: 15px; border-top: 2px solid #dc3545;'>
                    <p><strong>Zwischensumme:</strong> {$subtotal} CHF</p>
                    <p><strong>Versand:</strong> Kostenlos</p>
                    <p class='total'>GESAMT BEZAHLT: {$total} CHF</p>
                </div>
            </div>

            <div class='next-steps'>
                <h3>📦 Nächste Schritte</h3>
                <p>✅ Zahlung von PayPal bestätigt</p>
                <p>📋 Bestellung bearbeiten und Versand vorbereiten</p>
                <p>📮 Versand in 2-3 Werktagen an:</p>
                <p><strong>{$customerInfo['address']}, {$customerInfo['postalCode']} {$customerInfo['city']}</strong></p>
                <p>📧 Tracking-Nummer an Kunde senden: {$customerInfo['email']}</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $content;
}

function generateCustomerPayPalEmail($customerInfo, $billingAddress, $cart, $total, $orderNumber, $paypalPayerID) {
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    
    $timestamp = date('Y-m-d H:i:s');
    
    $content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .thank-you { background-color: #d4edda; padding: 20px; margin: 15px 0; border-radius: 5px; text-align: center; }
            .order-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #dc3545; }
            .shipping-info { background-color: #e7f3ff; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>🔥 Salsas.ch</h1>
            <p>Vielen Dank für Ihre Bestellung!</p>
        </div>
        
        <div class='content'>
            <div class='thank-you'>
                <h2>✅ Bestellung bestätigt!</h2>
                <p>Liebe/r {$customerInfo['firstName']},</p>
                <p>Vielen Dank für Ihre Bestellung bei Salsas.ch! Ihre Zahlung wurde erfolgreich verarbeitet.</p>
            </div>

            <div class='order-details'>
                <h2>📋 Ihre Bestelldetails</h2>
                <p><strong>Bestellnummer:</strong> {$orderNumber}</p>
                <p><strong>PayPal ID:</strong> {$paypalPayerID}</p>
                <p><strong>Datum:</strong> " . date('d.m.Y H:i', strtotime($timestamp)) . "</p>
                <p><strong>Status:</strong> ✅ Bezahlt</p>
            </div>

            <div class='order-details'>
                <h2>🛒 Bestellte Produkte</h2>";
    
    foreach ($cart as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $content .= "
                <div class='product-item'>
                    <p><strong>{$item['name']}</strong></p>
                    <p>Menge: {$item['quantity']} x {$item['price']} CHF = {$itemTotal} CHF</p>
                    <p><em>{$item['description']}</em></p>
                </div>";
    }
    
    $content .= "
                <div style='margin-top: 20px; padding-top: 15px; border-top: 2px solid #dc3545;'>
                    <p><strong>Zwischensumme:</strong> {$subtotal} CHF</p>
                    <p><strong>Versand:</strong> Kostenlos</p>
                    <p class='total'>GESAMT: {$total} CHF</p>
                </div>
            </div>

            <div class='order-details'>
                <h2>📮 Lieferadresse</h2>
                <p><strong>{$customerInfo['firstName']} {$customerInfo['lastName']}</strong></p>
                <p>{$customerInfo['address']}</p>
                <p>{$customerInfo['postalCode']} {$customerInfo['city']}</p>
                <p>{$customerInfo['canton']}</p>
            </div>";
    
    // Agregar dirección de facturación si es diferente
    if ($billingAddress) {
        $content .= "
            <div class='order-details'>
                <h2>💳 Rechnungsadresse</h2>
                <div style='background-color: #fef3c7; padding: 15px; margin-bottom: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;'>
                    <p><strong>Ihre Rechnung wird an diese abweichende Adresse gesendet:</strong></p>
                </div>
                <p><strong>{$billingAddress['firstName']} {$billingAddress['lastName']}</strong></p>
                <p>{$billingAddress['address']}</p>
                <p>{$billingAddress['postalCode']} {$billingAddress['city']}</p>
                <p>{$billingAddress['canton']}</p>
            </div>";
    }
    
    $content .= "

            <div class='shipping-info'>
                <h3>📦 Was passiert als nächstes?</h3>
                <p>✅ Ihre Zahlung wurde bestätigt</p>
                <p>📦 Wir bereiten Ihre Bestellung vor</p>
                <p>🚚 Versand in 2-3 Werktagen</p>
                <p>📧 Sie erhalten eine Tracking-Nummer per E-Mail</p>
                <p>📞 Bei Fragen: info@cantinatexmex.ch</p>
            </div>

            <div class='footer'>
                <p><strong>Vielen Dank für Ihr Vertrauen!</strong></p>
                <p>🔥 Salsas.ch Team</p>
                <p>info@cantinatexmex.ch</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $content;
}
?>