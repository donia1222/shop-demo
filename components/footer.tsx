"use client"

import { Truck, Shield, MapPin, CreditCard, Phone, Mail, Flame, Heart, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminLoginButton } from "@/components/admin-auth"

interface FooterProps {
  onAdminOpen?: () => void
}

export function Footer({ onAdminOpen }: FooterProps = {}) {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const legalContent = {
    agb: {
      title: "Allgemeine Geschäftsbedingungen",
      content: `
        1. Geltungsbereich
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Online-Shop.

        2. Vertragsschluss
        Der Vertrag kommt durch Ihre Bestellung und unsere Auftragsbestätigung zustande.

        3. Preise und Zahlung
        Alle Preise verstehen sich in CHF inklusive der gesetzlichen Mehrwertsteuer.
        Zahlung erfolgt per PayPal, Kreditkarte oder Banküberweisung.

        4. Lieferung
        Wir liefern nur innerhalb der Schweiz.
        Die Lieferzeit beträgt 1-3 Werktage.
        Versandkosten werden bei Bestellungen unter 50 CHF erhoben.

        5. Widerrufsrecht
        Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

        6. Gewährleistung
        Es gelten die gesetzlichen Gewährleistungsbestimmungen.
      `,
    },
    datenschutz: {
      title: "Datenschutzrichtlinie",
      content: `
        1. Datenerhebung
        Wir erheben nur die für die Bestellabwicklung notwendigen Daten.

        2. Verwendung der Daten
        Ihre Daten werden ausschließlich zur Bestellabwicklung verwendet.

        3. Datenweitergabe
        Eine Weitergabe an Dritte erfolgt nur zur Bestellabwicklung (Versanddienstleister).

        4. Datensicherheit
        Wir verwenden SSL-Verschlüsselung zum Schutz Ihrer Daten.

        5. Ihre Rechte
        Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten.

        6. Kontakt
        Bei Fragen zum Datenschutz kontaktieren Sie uns unter info@lweb.ch
      `,
    },
    rueckgabe: {
      title: "Rückgaberichtlinie",
      content: `
        1. Rückgaberecht
        Sie können Artikel innerhalb von 14 Tagen nach Erhalt zurückgeben.

        2. Zustand der Ware
        Die Ware muss sich in originalem, unbenutztem Zustand befinden.

        3. Rückgabeprozess
        Kontaktieren Sie uns vor der Rücksendung unter info@lweb.ch

        4. Rücksendekosten
        Die Kosten für die Rücksendung trägt der Kunde.

        5. Erstattung
        Die Erstattung erfolgt innerhalb von 14 Tagen nach Erhalt der Rücksendung.

        6. Ausnahmen
        Aus hygienischen Gründen können geöffnete Lebensmittel nicht zurückgenommen werden.
      `,
    },
  }

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating elements for spice theme */}
      <div className="absolute top-10 left-10 opacity-10">
        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
      </div>
      <div className="absolute top-20 right-20 opacity-10">
        <Flame className="w-6 h-6 text-red-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-20 left-1/4 opacity-10">
        <Flame className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Top Section with Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Flame className="w-12 h-12 text-red-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-bounce opacity-80"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Salsas.ch
            </h2>
            <div className="relative">
              <Flame className="w-12 h-12 text-orange-500 scale-x-[-1]" />
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ihre Quelle für die schärfsten und geschmackvollsten Saucen der Schweiz. 
            <span className="text-red-400 font-semibold"> Handwerkliche Qualität</span> direkt zu Ihnen geliefert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Shipping Information */}
          <div className="group">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-white group-hover:text-red-400 transition-colors">
                <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                  <Truck className="h-6 w-6 text-red-500" />
                </div>
                Versand
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
                  <MapPin className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Schweizweite Lieferung mit A-Post</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
                  <Shield className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Kostenloser Versand ab 50 CHF</span>
                </div>
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
                  <p className="text-red-300 font-medium text-xs">⚡ Express-Lieferung: 1-3 Werktage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="group">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-white group-hover:text-green-400 transition-colors">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
                Sichere Zahlung
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">PP</div>
                  <span>PayPal - 100% sicher</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <span>Kredit- und Debitkarten</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <span>Sichere Banküberweisung</span>
                </div>
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-3 mt-4">
                  <p className="text-green-300 font-medium text-xs">🔒 SSL-verschlüsselt & geschützt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="group">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-white group-hover:text-orange-400 transition-colors">
                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <Heart className="h-6 w-6 text-orange-500" />
                </div>
                Über Uns
              </h3>
              <div className="space-y-4 text-sm">
                <p className="text-gray-300 leading-relaxed">Premium handwerkliche Saucen direkt aus den USA importiert</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item">
                    <Mail className="h-4 w-4 text-blue-400 group-hover/item:text-blue-300" />
                    <a href="mailto:info@lweb.ch" className="hover:text-blue-400 transition-colors">
                      info@lweb.ch
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item">
                    <Phone className="h-4 w-4 text-green-400 group-hover/item:text-green-300" />
                    <a href="tel:+41765608645" className="hover:text-green-400 transition-colors">
                      +41 76 560 86 45
                    </a>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-3 mt-4">
                  <p className="text-orange-300 font-medium text-xs">🌶️ Authentisch & garantiert scharf!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="group">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-white group-hover:text-purple-400 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                Support & Recht
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <Dialog open={openModal === "agb"} onOpenChange={(open) => setOpenModal(open ? "agb" : null)}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-purple-400 transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Allgemeine Geschäftsbedingungen
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">{legalContent.agb.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-gray-200">
                        {legalContent.agb.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Dialog
                    open={openModal === "datenschutz"}
                    onOpenChange={(open) => setOpenModal(open ? "datenschutz" : null)}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-purple-400 transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Datenschutzrichtlinie
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">{legalContent.datenschutz.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-gray-200">
                        {legalContent.datenschutz.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Dialog
                    open={openModal === "rueckgabe"}
                    onOpenChange={(open) => setOpenModal(open ? "rueckgabe" : null)}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-purple-400 transition-colors group/btn">
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover/btn:opacity-100" />
                        Rückgaberichtlinie
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">{legalContent.rueckgabe.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-line text-sm text-gray-200">
                        {legalContent.rueckgabe.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3 mt-4">
                  <p className="text-purple-300 font-medium text-xs">💬 Schneller Kundenservice</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits and Design Info */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 flex items-center gap-2">
                <span className="text-blue-400">📸</span>
                <strong className="text-gray-300">Bildnachweis:</strong> Einige Bilder stammen von Freepik
              </p>
            </div>
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 flex items-center gap-2">
                <span className="text-red-400">🎨</span>
                <strong className="text-gray-300">Webseite Design:</strong>{" "}
                <a
                  href="https://lweb.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  lweb.ch
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© 2025 Salsas.ch. Alle Rechte vorbehalten.</p>
              <p className="text-xs text-gray-500 mt-1">Mit ❤️ und 🌶️ für Sauce-Liebhaber gemacht</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400 bg-gradient-to-r from-blue-500/10 to-red-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Made in USA</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 bg-gradient-to-r from-green-500/10 to-blue-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <Shield className="h-4 w-4 text-green-400" />
                <span>100% Sicher</span>
              </div>
              {/* Admin Login */}
              {onAdminOpen && (
                <AdminLoginButton
                  onAdminOpen={onAdminOpen}
                  className="hover:bg-gray-700/50 border border-gray-600/50"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-50"></div>

    </footer>
  )
}