"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminLoginButton } from "@/components/admin-auth"
import { Facebook, Twitter, Instagram, Newspaper, ArrowRight, Download, ShieldCheck } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function Footer() {
  const router = useRouter()
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [paySettings, setPaySettings] = useState<{
    enable_paypal: boolean
    enable_stripe: boolean
    enable_twint: boolean
    enable_invoice: boolean
  } | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_payment_settings.php`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.settings) {
          const s = data.settings
          setPaySettings({
            enable_paypal: !!s.enable_paypal,
            enable_stripe: !!s.enable_stripe,
            enable_twint: !!s.enable_twint,
            enable_invoice: s.enable_invoice !== false,
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleDownloadVCard = () => {
    const vCardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:Hot-Sauce Shop\nORG:Hot-Sauce Shop\nTITLE:SCHARFE SAUCEN · SCHWEIZ\nADR:;;Bahnhofstrasse 2;Sevelen;;9475;Switzerland\nTEL:+41786066105\nEMAIL:info@hot-sauce-shop.ch\nURL:https://hot-sauce-shop.ch\nEND:VCARD`
    const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "Hot-Sauce-Shop.vcf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const legalContent = {
    agb: {
      title: "Allgemeine Geschäftsbedingungen (AGB)",
      content: `Hot-Sauce Shop | Bahnhofstrasse 2, 9475 Sevelen | info@hot-sauce-shop.ch

1. GELTUNGSBEREICH
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die über den Online-Shop von Hot-Sauce Shop abgeschlossen werden. Abweichende Bedingungen des Käufers werden nicht anerkannt, es sei denn, wir stimmen ihrer Geltung ausdrücklich schriftlich zu.

2. VERTRAGSSCHLUSS
Das Angebot in unserem Online-Shop stellt eine unverbindliche Einladung zur Bestellung dar. Durch das Absenden der Bestellung geben Sie ein verbindliches Angebot ab. Der Kaufvertrag kommt erst mit unserer schriftlichen Auftragsbestätigung per E-Mail zustande. Wir behalten uns das Recht vor, Bestellungen ohne Angabe von Gründen abzulehnen.

3. SORTIMENT & PRODUKTE
Unser Sortiment umfasst Hot Sauces, Chilisaucen, Gewürze und scharfe Spezialitäten aus aller Welt, insbesondere: Tabasco-Sorten, mexikanische Saucen, karibische Saucen, Habanero-Saucen und exklusive Importartikel. Alle Produkte werden in Übereinstimmung mit den geltenden Schweizer Lebensmittelgesetzen angeboten.

4. PREISE UND ZAHLUNG
Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive der gesetzlichen Mehrwertsteuer (MwSt.). Versandkosten werden im Bestellprozess separat ausgewiesen. Wir akzeptieren folgende Zahlungsmittel: TWINT, PostFinance, VISA, Mastercard, American Express sowie PayPal. Der Kaufpreis ist mit Abschluss der Bestellung fällig.

5. LIEFERUNG
Wir liefern ausschliesslich innerhalb der Schweiz. Die Lieferzeit beträgt in der Regel 1–3 Werktage nach Zahlungseingang. Bei Lieferverzögerungen informieren wir Sie unverzüglich. Das Versandrisiko geht mit Übergabe an den Paketdienstleister auf den Käufer über.

6. WIDERRUFSRECHT & RÜCKGABE
Sie haben das Recht, Ihre Bestellung innerhalb von 14 Tagen ab Erhalt der Ware ohne Angabe von Gründen zu widerrufen. Die Ware ist in originalem, unbenutztem Zustand und in der Originalverpackung zurückzusenden. Die Rücksendekosten trägt der Käufer. Ausgenommen vom Widerrufsrecht sind auf Kundenwunsch angefertigte oder personalisierte Artikel sowie Hygieneartikel nach Entsiegelung.

7. GEWÄHRLEISTUNG
Es gelten die gesetzlichen Gewährleistungsrechte nach Schweizer OR. Bei Sachmängeln haben Sie das Recht auf Nachbesserung oder Ersatzlieferung. Schlägt die Nacherfüllung fehl, können Sie vom Vertrag zurücktreten oder den Kaufpreis mindern.

8. HAFTUNG
Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Im Übrigen ist unsere Haftung auf den vorhersehbaren, vertragstypischen Schaden beschränkt. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit keine wesentlichen Vertragspflichten verletzt werden.

9. ANWENDBARES RECHT & GERICHTSSTAND
Es gilt ausschliesslich Schweizer Recht. Gerichtsstand für alle Streitigkeiten ist Sevelen, Kanton St. Gallen, Schweiz.

10. SCHLUSSBESTIMMUNGEN
Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Stand: Februar 2026.`,
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      content: `Hot-Sauce Shop | Bahnhofstrasse 2, 9475 Sevelen | info@hot-sauce-shop.ch

Diese Datenschutzerklärung informiert Sie gemäss dem Schweizer Datenschutzgesetz (DSG) sowie der EU-Datenschutz-Grundverordnung (DSGVO) über die Verarbeitung Ihrer personenbezogenen Daten.

1. VERANTWORTLICHE STELLE
Hot-Sauce Shop
Bahnhofstrasse 2, 9475 Sevelen, Schweiz
Telefon: 078 606 61 05
E-Mail: info@hot-sauce-shop.ch

2. WELCHE DATEN WIR ERHEBEN
Im Rahmen der Bestellabwicklung erheben wir folgende Daten: Vor- und Nachname, Lieferadresse, E-Mail-Adresse, Telefonnummer sowie Zahlungsinformationen. Beim Besuch unserer Website werden technische Daten wie IP-Adresse, Browsertyp, Besuchsdauer und aufgerufene Seiten automatisch erfasst.

3. ZWECK DER DATENVERARBEITUNG
Wir verwenden Ihre Daten ausschliesslich für folgende Zwecke: Abwicklung und Bestätigung Ihrer Bestellungen, Versand und Lieferung der gekauften Produkte (Hot Sauces, Chilisaucen, Gewürze etc.), Kundenkommunikation und Support, Erfüllung gesetzlicher Pflichten sowie zur Verbesserung unseres Angebots.

4. RECHTSGRUNDLAGE
Die Verarbeitung Ihrer Daten erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO) sowie auf Basis unseres berechtigten Interesses an einem sicheren und effizienten Shopbetrieb (Art. 6 Abs. 1 lit. f DSGVO).

5. WEITERGABE VON DATEN
Ihre Daten werden nur an Dritte weitergegeben, soweit dies für die Vertragsabwicklung notwendig ist (z. B. Paketdienstleister für die Lieferung, Zahlungsanbieter wie PayPal, TWINT oder PostFinance). Eine Weitergabe zu Werbezwecken an Dritte findet nicht statt.

6. DATENSICHERHEIT
Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um Ihre Daten vor Verlust, Manipulation und unberechtigtem Zugriff zu schützen. Unser Online-Shop ist durch SSL/TLS-Verschlüsselung gesichert.

7. SPEICHERDAUER
Ihre Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck notwendig ist oder gesetzliche Aufbewahrungsfristen (in der Regel 10 Jahre für Buchhaltungsunterlagen) es erfordern.

8. IHRE RECHTE
Sie haben jederzeit das Recht auf: Auskunft über Ihre gespeicherten Daten, Berichtigung unrichtiger Daten, Löschung Ihrer Daten (sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen), Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Zur Ausübung Ihrer Rechte wenden Sie sich an: info@hot-sauce-shop.ch

9. COOKIES
Unsere Website verwendet technisch notwendige Cookies, die für den Betrieb des Shops erforderlich sind. Analytische oder Marketing-Cookies werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.

10. ÄNDERUNGEN
Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Stand: Februar 2026.`,
    },
    zahlungsarten: {
      title: "Zahlungsarten",
      content: `Hot-Sauce Shop akzeptiert folgende Zahlungsmittel:

TWINT
Bezahlen Sie schnell und sicher direkt per Smartphone-App. TWINT ist die meistgenutzte Schweizer Bezahl-App und funktioniert ohne Kreditkarte. Der Betrag wird sofort von Ihrem Konto abgebucht.

PostFinance
Bezahlen Sie bequem über Ihr PostFinance-Konto (E-Finance oder PostFinance Card). Ideal für alle PostFinance-Kunden in der Schweiz.

VISA / Mastercard / American Express
Wir akzeptieren alle gängigen Kredit- und Debitkarten. Die Zahlung erfolgt verschlüsselt über eine sichere SSL-Verbindung. Ihr Kartendaten werden nicht gespeichert.

PayPal
Bezahlen Sie über Ihr bestehendes PayPal-Konto. PayPal bietet einen integrierten Käuferschutz und ist weltweit verbreitet.

Allgemeine Hinweise
— Alle Preise verstehen sich in Schweizer Franken (CHF) inkl. MwSt.
— Der Kaufbetrag wird erst nach Versandbestätigung belastet.
— Bei Fragen zur Zahlung erreichen Sie uns unter info@hot-sauce-shop.ch oder 078 606 61 05.`,
    },
    cookies: {
      title: "Cookie Manager",
      content: `Was sind Cookies?
Cookies sind kleine Textdateien, die beim Besuch unserer Website auf Ihrem Gerät gespeichert werden. Sie ermöglichen es, Einstellungen zu speichern und die Nutzung der Website zu verbessern.

Technisch notwendige Cookies
Diese Cookies sind für den Betrieb des Online-Shops unbedingt erforderlich. Sie ermöglichen grundlegende Funktionen wie Warenkorb, Login und Sitzungsverwaltung. Diese Cookies können nicht deaktiviert werden.
— Sitzungs-Cookie (Session): Speichert Ihre aktuelle Sitzung (Warenkorb, Login-Status).
— Sicherheits-Cookie: Schützt vor Cross-Site-Request-Forgery (CSRF).

Funktionale Cookies
Diese Cookies ermöglichen erweiterte Funktionen wie gespeicherte Spracheinstellungen oder zuletzt angesehene Produkte. Sie können diese Cookies deaktivieren, was jedoch die Funktionalität einschränken kann.

Analyse-Cookies
Wir verwenden keine externen Analyse-Dienste (z. B. Google Analytics) ohne Ihre ausdrückliche Einwilligung.

Ihre Rechte
Gemäss Schweizer DSG und EU-DSGVO haben Sie das Recht, Cookies abzulehnen oder zu löschen. Sie können Cookies jederzeit über die Einstellungen Ihres Browsers verwalten oder löschen:
— Chrome: Einstellungen → Datenschutz → Cookies
— Firefox: Einstellungen → Datenschutz → Cookies
— Safari: Einstellungen → Datenschutz → Cookies verwalten

Bei Fragen: info@hot-sauce-shop.ch`,
    },
    ueberuns: {
      title: "Über uns",
      content: `Hot-Sauce Shop
Ihr Schweizer Spezialist für Hot Sauces & Chilisaucen

Wer wir sind
Hot-Sauce Shop ist ein familiengeführtes Fachgeschäft mit Sitz in Sevelen, Kanton St. Gallen. Wir sind Ihr verlässlicher Partner für scharfe Saucen, Chilispezialitäten und Gewürze aus aller Welt – mit persönlicher Beratung und einem sorgfältig kuratierten Sortiment.

Was uns auszeichnet
Unser Team besteht aus passionierten Hot-Sauce-Liebhabern, die ihre Produkte selbst kennen und lieben. Wir verkaufen nur, was wir selbst für gut befinden – Qualität vor Quantität.

Unser Sortiment
— Mexikanische Saucen: Tabasco, Valentina, Cholula, El Yucateco und mehr
— Karibische Saucen: Habanero, Scotch Bonnet und tropische Aromen
— Amerikanische Saucen: Frank's RedHot, Dave's Gourmet, Blair's und viele mehr
— Asiatische Saucen: Sriracha, Sambal und fernöstliche Spezialitäten
— Exklusive Importartikel: Limitierte und schwer erhältliche Saucen weltweit
— Gewürze & Zubehör: Chilipulver, Rubs und alles für den scharfen Genuss

Unsere Werte
Wir legen grössten Wert auf Schweizer Qualitätsstandards, ehrliche Beratung und ein authentisches Sortiment. Jede Sauce in unserem Shop wird persönlich ausgewählt und getestet.

Besuchen Sie uns
Bahnhofstrasse 2, 9475 Sevelen
Mo – Fr: 13:30 – 18:30 | Sa: 10:00 – 16:00
📞 078 606 61 05 | info@hot-sauce-shop.ch`,
    },
    impressum: {
      title: "Impressum",
      content: `Angaben gemäss Schweizer Recht (OR Art. 944)

BETREIBER DES ONLINE-SHOPS
Hot-Sauce Shop
Bahnhofstrasse 2
9475 Sevelen
Kanton St. Gallen, Schweiz

INHABER
Urs Schwendener

KONTAKT
Telefon: 078 606 61 05
E-Mail: info@hot-sauce-shop.ch
Website: www.hot-sauce-shop.ch

ÖFFNUNGSZEITEN
Montag – Donnerstag: 13:30 – 18:30 Uhr
Freitag: 13:30 – 18:30 Uhr
Samstag: 10:00 – 16:00 Uhr
Sonntag: Geschlossen

UNTERNEHMENSFORM
Einzelunternehmen / Kleinunternehmen nach Schweizer Recht

MEHRWERTSTEUER
Alle Preise verstehen sich in CHF inklusive der gesetzlichen Schweizer Mehrwertsteuer (MwSt.).

VERANTWORTLICH FÜR DEN INHALT
Hot-Sauce Shop, Bahnhofstrasse 2, 9475 Sevelen

WEBDESIGN & UMSETZUNG
lweb.ch – Webdesign & Digitalagentur
Website: https://lweb.ch

HAFTUNGSAUSSCHLUSS
Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich. Alle Inhalte dieser Website sind urheberrechtlich geschützt.

ANWENDBARES RECHT
Es gilt ausschliesslich Schweizer Recht. Gerichtsstand ist Sevelen, Kanton St. Gallen.

Stand: Februar 2026`,
    },
    rueckgabe: {
      title: "Versand & Rückgabe",
      content: `Hot-Sauce Shop | Bahnhofstrasse 2, 9475 Sevelen | info@hot-sauce-shop.ch

1. VERSAND
Wir liefern ausschliesslich innerhalb der Schweiz. Bestellungen werden in der Regel innerhalb von 1–3 Werktagen nach Zahlungseingang versandt. Der Versand erfolgt mit einem zuverlässigen Schweizer Paketdienstleister. Sie erhalten nach dem Versand eine E-Mail mit Ihrer Sendungsverfolgungsnummer. Versandkosten werden transparent im Bestellprozess ausgewiesen.

2. RÜCKGABERECHT
Sie können bestellte Artikel innerhalb von 14 Tagen ab Erhalt ohne Angabe von Gründen zurückgeben. Bitte kontaktieren Sie uns vor der Rücksendung per E-Mail an info@hot-sauce-shop.ch oder telefonisch unter 078 606 61 05.

3. ZUSTAND DER WARE
Die Ware muss sich in originalem, unbenutztem Zustand befinden und in der Originalverpackung zurückgesendet werden. Die Ware darf keine Gebrauchsspuren aufweisen und muss ungeöffnet zurückgesendet werden.

4. AUSNAHMEN VOM RÜCKGABERECHT
Vom Rückgaberecht ausgenommen sind: geöffnete Lebensmittelartikel und Saucen nach Entsiegelung sowie auf Kundenwunsch zusammengestellte Sets.

5. RÜCKSENDEPROZESS
Bitte senden Sie die Ware gut verpackt an folgende Adresse zurück:
Hot-Sauce Shop
Bahnhofstrasse 2
9475 Sevelen

Die Rücksendekosten trägt der Käufer. Wir empfehlen, die Sendung versichert zu verschicken.

6. ERSTATTUNG
Nach Erhalt und Prüfung der zurückgesandten Ware erstatten wir den Kaufpreis innerhalb von 14 Tagen auf dem ursprünglichen Zahlungsweg. Bei TWINT, PayPal, PostFinance sowie Kredit- und Debitkarten erfolgt die Gutschrift direkt auf das verwendete Konto.

7. BESCHÄDIGTE ODER FALSCHE LIEFERUNG
Falls Sie eine beschädigte oder falsche Ware erhalten haben, wenden Sie sich bitte umgehend an uns. Wir übernehmen in diesem Fall die Rücksendekosten und liefern Ihnen die korrekte Ware auf dem schnellsten Weg zu.`,
    },
  }

  return (
    <footer className="bg-white mt-0">

      {/* ── Payment icons strip ── */}
      {paySettings && (paySettings.enable_invoice || paySettings.enable_stripe || paySettings.enable_twint || paySettings.enable_paypal) && (
        <div className="border-t border-b border-[#E0E0E0] py-3.5 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Sichere Zahlung */}
              <div className="flex items-center gap-1 pr-3 border-r border-[#E0E0E0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#CC0000]" />
                <span className="text-[10px] font-semibold text-[#555] tracking-widest uppercase">Sichere Zahlung</span>
              </div>
              {/* Factura / Transferencia */}
              {paySettings.enable_invoice && (
                <div className="h-7 px-3 rounded-md bg-[#F5F5F5] border border-[#E0E0E0] flex items-center gap-1.5 shadow-sm">
                  <span className="text-sm">🏦</span>
                  <span className="text-[10px] font-bold text-[#444] tracking-tight">Rechnung</span>
                </div>
              )}
              {/* TWINT */}
              {paySettings.enable_twint && (
                <div className="h-7 px-2.5 rounded-md bg-black flex items-center shadow-sm">
                  <img src="/twint-logo.svg" alt="TWINT" className="h-5 w-auto" />
                </div>
              )}
              {/* Stripe → Visa + Mastercard */}
              {paySettings.enable_stripe && (
                <>
                  <div className="h-7 px-3.5 rounded-md bg-[#1A1F71] flex items-center shadow-sm">
                    <span className="font-black text-white text-sm italic tracking-tight">VISA</span>
                  </div>
                  <div className="h-7 px-3 rounded-md bg-white border border-[#E0E0E0] flex items-center gap-1 shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90" />
                    <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 -ml-1.5" />
                    <span className="text-[10px] font-bold text-[#333] ml-1 tracking-tight">Mastercard</span>
                  </div>
                </>
              )}
              {/* PayPal */}
              {paySettings.enable_paypal && (
                <div className="h-7 px-2.5 rounded-md bg-white border border-[#E0E0E0] flex items-center shadow-sm">
                  <img src="/0014294_paypal-express-payment-plugin.png" alt="PayPal" className="h-5 w-auto object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Social icons ── */}
      <div className="border-b border-[#E0E0E0] py-4 bg-white">
        <div className="container mx-auto px-4 flex justify-center gap-6">
          {[
            { Icon: Facebook, href: null },
            { Icon: Twitter, href: null },
            { Icon: Instagram, href: null },
          ].map(({ Icon, href }, i) =>
            href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#CC0000] transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ) : (
              <button key={i} className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#CC0000] transition-colors">
                <Icon className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Footer columns ── */}
      <div className="bg-white border-t border-[#E8E8E8] py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">

            {/* LEFT: Logo + Contact + Hours */}
            <div>
              {/* Logo + name */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl leading-none flex-shrink-0">🌶️</span>
                <div>
                  <div className="leading-tight">
                    <span style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontStyle: 'italic', fontWeight: 900, color: '#CC0000', fontSize: '1.15rem' }}>HOT-SAUCE</span>
                    <span style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontWeight: 900, color: '#1A1A1A', fontSize: '1rem' }}> SHOP</span>
                  </div>
                  <div className="text-xs text-[#888] uppercase tracking-widest mt-1">Scharfe Saucen · Schweiz</div>
                </div>
              </div>

              {/* Contact pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <a href="https://maps.google.com/?q=Bahnhofstrasse+2+9475+Sevelen" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#444] text-sm px-3 py-1.5 rounded-full transition-colors">
                  <span className="text-base">📍</span> Bahnhofstrasse 2, 9475 Sevelen
                </a>
                <a href="tel:0786066105"
                  className="inline-flex items-center gap-2 bg-[#F5F5F5] hover:bg-[#CC0000] hover:text-white text-[#CC0000] font-semibold text-sm px-3 py-1.5 rounded-full transition-colors">
                  <span className="text-base">📞</span> 078 606 61 05
                </a>
                <a href="mailto:info@hot-sauce-shop.ch"
                  className="inline-flex items-center gap-2 bg-[#F5F5F5] hover:bg-[#CC0000] hover:text-white text-[#CC0000] font-semibold text-sm px-3 py-1.5 rounded-full transition-colors">
                  <span className="text-base">✉️</span> info@hot-sauce-shop.ch
                </a>
              </div>

              {/* Map + Opening hours */}
              <div className="flex flex-wrap gap-3">
            
           

                <div className="bg-[#FFF8F8] border border-[#E8E8E8] rounded-2xl p-4" style={{ width: "260px", flexShrink: 0 }}>
                  <p className="text-xs font-black text-[#CC0000] uppercase tracking-widest mb-3">Öffnungszeiten</p>
                  <div className="space-y-1.5">
                    {[
                      { day: "Mo – Fr", hours: "13:30 – 18:30", open: true },
                      { day: "Sa", hours: "10:00 – 16:00", open: true },
                      { day: "So", hours: "Geschlossen", open: false },
                    ].map(({ day, hours, open }) => (
                      <div key={day} className="flex items-center justify-between gap-6">
                        <span className={`text-sm font-medium ${open ? "text-[#333]" : "text-[#AAA]"}`}>{day}</span>
                        <span className={`text-sm ${open ? "text-[#1A1A1A] font-semibold" : "text-[#AAA]"}`}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Service */}
            <div>
              <h3 className="font-black text-[#1A1A1A] text-base mb-5 uppercase tracking-widest">Service</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@hot-sauce-shop.ch" className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors">Kontakt</a>
                </li>
                <li>
                  <Dialog open={openModal === "rueckgabe"} onOpenChange={(open) => setOpenModal(open ? "rueckgabe" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Versand und Rückgabe</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.rueckgabe.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.rueckgabe.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={openModal === "zahlungsarten"} onOpenChange={(open) => setOpenModal(open ? "zahlungsarten" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Zahlungsarten</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.zahlungsarten.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.zahlungsarten.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={openModal === "cookies"} onOpenChange={(open) => setOpenModal(open ? "cookies" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Cookie Manager</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.cookies.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.cookies.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <button
                    onClick={handleDownloadVCard}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Digitale Visitenkarte
                  </button>
                </li>
              </ul>
            </div>

            {/* Firma */}
            <div>
              <h3 className="font-black text-[#1A1A1A] text-base mb-5 uppercase tracking-widest">Firma</h3>
              <ul className="space-y-3">
                <li>
                  <Dialog open={openModal === "ueberuns"} onOpenChange={(open) => setOpenModal(open ? "ueberuns" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Über uns</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.ueberuns.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.ueberuns.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={openModal === "impressum"} onOpenChange={(open) => setOpenModal(open ? "impressum" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Impressum</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.impressum.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.impressum.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={openModal === "datenschutz"} onOpenChange={(open) => setOpenModal(open ? "datenschutz" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">Datenschutzerklärung</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.datenschutz.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.datenschutz.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={openModal === "agb"} onOpenChange={(open) => setOpenModal(open ? "agb" : null)}>
                    <DialogTrigger asChild>
                      <button className="text-sm font-medium text-[#444] hover:text-[#CC0000] transition-colors text-left">AGB</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{legalContent.agb.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-[#555]">{legalContent.agb.content}</div>
                    </DialogContent>
                  </Dialog>
                </li>
              </ul>

            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="bg-[#F5F5F5] border-t border-[#E0E0E0] py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#888]">
            <span className="flex items-center gap-3">
              <span>* Alle Preise inkl. MwSt., zzgl. Versandkosten</span>
              <span className="text-[#DDD] hidden md:inline">·</span>
              <span className="hidden md:flex items-center gap-1 text-[#AAA] text-xs">
                Design by&nbsp;<a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" className="font-black tracking-tight text-[#555] hover:text-[#CC0000] transition-colors uppercase text-[11px]">lweb.ch</a>
              </span>
            </span>
            <span className="font-semibold text-xs text-[#555]">Copyright © 2026 Hot-Sauce Shop. Alle Rechte vorbehalten.</span>
            <span className="flex items-center gap-2">
              <span className="flex md:hidden items-center gap-1 text-[#AAA] text-xs">
                Design by&nbsp;<a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" className="font-black tracking-tight text-[#555] hover:text-[#CC0000] transition-colors uppercase text-[11px]">lweb.ch</a>
              </span>
              <AdminLoginButton subtle />
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
