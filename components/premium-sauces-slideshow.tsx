"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Star, ShoppingCart, Minus, Plus, Award, MapPin } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  heatLevel: number
  rating: number
  badge?: string
  origin?: string
}

const IMG = "https://web.lweb.ch/templettedhop/upload/"

const sauces = [
  {
    id: 1,
    name: "Big Red's - Big Yella",
    flavor: "Goldgelbe Schärfe",
    description: "Goldgelbe Schärfe mit sonnigem Geschmack und intensivem Kick",
    image: "https://web.lweb.ch/templettedhop/upload/685c7d335c170_1750891827.webp",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
    price: 14.90,
    heatLevel: 4,
    rating: 4.80,
    badge: "Sonnig",
    origin: "USA",
  },
  {
    id: 2,
    name: "Big Red's - Heat Wave",
    flavor: "Feurig Scharf",
    description: "Eine Hitzewelle aus roten Chilis für wahre Schärfe-Liebhaber",
    image: "https://web.lweb.ch/templettedhop/upload/686be19d9a1d0_1751900573.png",
    color: "from-red-600 to-orange-700",
    bgColor: "bg-gradient-to-br from-red-50 to-orange-50",
    price: 12.84,
    heatLevel: 5,
    rating: 4.90,
    badge: "Hitzewelle",
    origin: "USA",
  },
  {
    id: 3,
    name: "Big Red's - Green Chili",
    flavor: "Grün & Frisch",
    description: "Frische grüne Chilis mit authentischem mexikanischem Geschmack",
    image: "https://web.lweb.ch/templettedhop/upload/686bf10c530b3_1751904524.webp",
    color: "from-green-600 to-emerald-700",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    price: 11.24,
    heatLevel: 3,
    rating: 5.00,
    badge: "Frisch",
    origin: "USA",
  },
  {
    id: 4,
    name: "Big Red's - Original Sauce",
    flavor: "Klassisch Original",
    description: "Die legendäre Originalrezept seit Generationen unverändert",
    image: "https://web.lweb.ch/templettedhop/upload/685c7d7713465_1750891895.webp",
    color: "from-red-700 to-rose-800",
    bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
    price: 1.10,
    heatLevel: 4,
    rating: 4.60,
    badge: "Klassiker",
    origin: "USA",
  },
  {
    id: 5,
    name: "Big Red's - Habanero",
    flavor: "Habanero Feuer",
    description: "Authentische Habanero-Chilis für den ultimativen Schärfe-Genuss",
    image: IMG + "686bf5f4a425b_1751905780.jpg",
    color: "from-orange-600 to-red-700",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    price: 14.93,
    heatLevel: 3,
    rating: 4.80,
    badge: "Habanero",
    origin: "USA",
  },
  {
    id: 11,
    name: "Honey BBQ",
    flavor: "Süß & Rauchig",
    description: "Eine perfekte Mischung aus natürlichem Honig und rauchigen Gewürzen, die jeden Grillabend veredelt",
    image: IMG + "685d3bbfd4b29_1750940607.webp",
    color: "from-amber-600 to-orange-700",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    price: 14.00,
    heatLevel: 3,
    rating: 4.90,
    badge: "Süß",
    origin: "USA",
  },
  {
    id: 12,
    name: "Garlic BBQ",
    flavor: "Intensiver Knoblauch",
    description: "Für Knoblauch-Liebhaber - eine Geschmacksexplosion, die Ihr Fleisch transformiert",
    image: IMG + "685c7cb9d36ea_1750891705.webp",
    color: "from-stone-600 to-amber-700",
    bgColor: "bg-gradient-to-br from-stone-50 to-amber-50",
    price: 14.00,
    heatLevel: 1,
    rating: 4.90,
    badge: "Intensiv",
    origin: "USA",
  },
  {
    id: 13,
    name: "Carolina-Style BBQ",
    flavor: "Carolina-Stil",
    description: "Traditionelles Südstaaten-Rezept, international preisgekrönt",
    image: IMG + "685c7cc861e68_1750891720.webp",
    color: "from-yellow-600 to-amber-700",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
    price: 14.00,
    heatLevel: 5,
    rating: 4.90,
    badge: "Preisgekrönt",
    origin: "USA",
  },
  {
    id: 14,
    name: "Coffee BBQ",
    flavor: "Kaffee & Gewürze",
    description: "Eine einzigartige Kombination aus geröstetem Kaffee und geheimen Gewürzen für anspruchsvolle Gaumen",
    image: IMG + "685c8b904c29e_1750895504.webp",
    color: "from-amber-800 to-stone-800",
    bgColor: "bg-gradient-to-br from-amber-50 to-stone-50",
    price: 14.00,
    heatLevel: 1,
    rating: 4.00,
    badge: "Gourmet",
    origin: "USA",
  },
  {
    id: 15,
    name: "Chipotle BBQ",
    flavor: "Scharf Geräuchert",
    description: "Das perfekte Gleichgewicht zwischen Chipotle-Schärfe und traditionellem Rauchgeschmack",
    image: IMG + "685c7cebd9c04_1750891755.webp",
    color: "from-red-700 to-amber-800",
    bgColor: "bg-gradient-to-br from-red-50 to-amber-50",
    price: 14.00,
    heatLevel: 2,
    rating: 4.80,
    badge: "Scharf",
    origin: "USA",
  },
  {
    id: 16,
    name: "Pineapple Papaya BBQ",
    flavor: "Tropisch Fruchtig",
    description: "Tropische Aromen, die Ihre Sinne in ein kulinarisches Paradies entführen",
    image: IMG + "685c7cf6513bb_1750891766.webp",
    color: "from-orange-600 to-amber-700",
    bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
    price: 14.00,
    heatLevel: 2,
    rating: 4.60,
    badge: "Tropisch",
    origin: "USA",
  },
]

interface PremiumSaucesProps {
  onAddToCart?: (product: Product, quantity: number) => void
  purchasedItems?: Set<number>
  onMarkAsPurchased?: (productId: number) => void
}

export function PremiumSaucesSlideshow({
  onAddToCart = () => {},
  purchasedItems = new Set(),
  onMarkAsPurchased = () => {},
}: PremiumSaucesProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 1
      const next = Math.min(10, Math.max(1, current + delta))
      return { ...prev, [id]: next }
    })
  }

  const getQty = (id: number) => quantities[id] ?? 1

  const renderHeatLevel = (level: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Flame
        key={i}
        className={`w-4 h-4 transition-all duration-300 ${i < level ? "text-red-500 fill-red-500" : "text-gray-300"}`}
      />
    ))

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors duration-300 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Modern Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/5 to-yellow-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Premium BBQ Collection
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            SMOKEHOUSE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              BBQ SAUCEN
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handwerklich geräucherte Premium-Saucen für den perfekten Grillgenuss
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sauces.map((sauce) => (
            <Card
              key={sauce.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={sauce.image || "/placeholder.svg"}
                  alt={sauce.name}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white font-semibold shadow-sm">
                    {sauce.badge}
                  </Badge>
                  <Badge variant="outline" className="bg-white/90 border-gray-200 text-gray-700 font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    {sauce.origin}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Product Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{sauce.name}</h3>
                  <p className="text-orange-600 font-semibold text-sm mb-2">{sauce.flavor}</p>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{sauce.description}</p>
                </div>

                {/* Rating and Heat Level */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(sauce.rating)}</div>
                    <span className="text-sm font-medium text-gray-700">{sauce.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">{renderHeatLevel(sauce.heatLevel)}</div>
                </div>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900">
                    {(sauce.price * getQty(sauce.id)).toFixed(2)} CHF
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateQty(sauce.id, -1)}
                      className="px-3 hover:bg-gray-200 text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                      {getQty(sauce.id)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateQty(sauce.id, 1)}
                      className="px-3 hover:bg-gray-200 text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => {
                    const product: Product = {
                      id: sauce.id,
                      name: sauce.name,
                      price: sauce.price,
                      image: sauce.image,
                      description: sauce.description,
                      heatLevel: sauce.heatLevel,
                      rating: sauce.rating,
                      badge: sauce.badge,
                      origin: sauce.origin,
                    }
                    onAddToCart(product, getQty(sauce.id))
                    onMarkAsPurchased(sauce.id)
                  }}
                  disabled={purchasedItems.has(sauce.id)}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {purchasedItems.has(sauce.id) ? "✓ Hinzugefügt" : "In Warenkorb"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Noch nicht das Richtige gefunden?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Entdecken Sie unsere komplette Smokehouse-Kollektion mit noch mehr handwerklich geräucherten
                Spezialitäten und Grill-Klassikern.
              </p>
              <Button
                onClick={() => {
                  const offersSection = document.getElementById("offers")
                  if (offersSection) {
                    offersSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Mehr BBQ-Produkte entdecken
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
