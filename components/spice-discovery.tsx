"use client"

import { useState, useEffect, useCallback } from "react"
import { Flame, ShoppingCart, Thermometer, Star } from "lucide-react"
import FireThermometer from "./fire-thermometer"

interface Product {
  id?: number
  name: string
  description: string
  price: number
  image?: string
  image_url?: string
  heatLevel: number
  rating: number
  badge?: string
  origin?: string
  category?: string
  stock?: number
}

interface ApiProduct {
  id?: number
  name: string
  description: string
  price: number
  image?: string
  image_url?: string
  heat_level: number
  rating: number
  badge: string
  origin: string
  category?: string
  stock?: number
  created_at?: string
  updated_at?: string
}

interface ApiResponse {
  success: boolean
  products: ApiProduct[]
  total?: number
  stats?: {
    total_products: number
    hot_sauces: number
    bbq_sauces: number
  }
  error?: string
}

interface SpiceDiscoveryProps {
  products?: Product[]
  onAddToCart?: (product: Product, quantity?: number) => void
  className?: string
}

export default function SpiceDiscovery({
  products = [],
  onAddToCart: _onAddToCart = () => {},
  className = "",
}: SpiceDiscoveryProps) {
  const [selectedHeatLevel, setSelectedHeatLevel] = useState(1)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleKaufenClick = (product: Product) => {
    const productsSection = document.getElementById("offers")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("openProductModal", {
          detail: { productId: product.id, productName: product.name },
        })
      )
    }, 800)
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE_URL}/get_products.php`)
        const data: ApiResponse = await response.json()
        if (data.success) {
          const normalized: Product[] = data.products.map((p: ApiProduct) => ({
            ...p,
            heatLevel: p.heat_level || 0,
            stock: p.stock || 0,
            badge: p.badge || "SALSA",
            origin: p.origin || "Unbekannt",
          }))
          setApiProducts(normalized)
        } else {
          throw new Error(data.error || "Fehler beim Laden")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Laden der Produkte")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    if (apiProducts.length > 0) {
      updateRecommendations(selectedHeatLevel)
    }
  }, [apiProducts])

  const updateRecommendations = (heatLevel: number) => {
    const source = apiProducts.length > 0 ? apiProducts : products
    if (source.length > 0) {
      const filtered = source
        .filter((p) => p.heatLevel === heatLevel)
        .sort((a, b) => {
          if ((a.stock || 0) === 0 && (b.stock || 0) > 0) return 1
          if ((a.stock || 0) > 0 && (b.stock || 0) === 0) return -1
          return b.rating - a.rating
        })
      setRecommendedProducts(filtered.slice(0, 3))
      setShowRecommendations(true)
    }
  }

  const handleHeatLevelChange = useCallback(
    (level: number) => {
      setSelectedHeatLevel(level)
      updateRecommendations(level)
    },
    [apiProducts, products]
  )

  const handleProductRecommend = useCallback((_products: Product[]) => {}, [])

  const renderProductCard = (product: Product, index: number) => {
    const isOutOfStock = (product.stock || 0) === 0

    return (
      <div
        key={product.id ?? index}
        className={`group bg-white/8 hover:bg-white/12 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 overflow-hidden ${
          showRecommendations ? "animate-slide-up" : "opacity-0"
        }`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="p-4 flex gap-3.5">
          {/* Image */}
          <div className="relative w-[68px] h-[68px] flex-shrink-0 rounded-xl overflow-hidden bg-white/10">
            <img
              src={product.image_url || product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.badge && (
              <span className="absolute top-0.5 right-0.5 bg-[#CC0000] text-white text-[9px] font-black px-1 py-0.5 rounded leading-tight">
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm leading-tight line-clamp-1 mb-1 group-hover:text-[#FF6666] transition-colors">
              {product.name}
            </h4>
            <p className="text-white/50 text-xs line-clamp-2 leading-relaxed mb-2.5">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              {/* Heat flames */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: Math.min(product.heatLevel, 5) }, (_, i) => (
                  <Flame key={i} className="w-3 h-3 text-[#CC0000] fill-[#CC0000]" />
                ))}
              </div>
              {/* CTA */}
              <button
                onClick={() => handleKaufenClick(product)}
                disabled={isOutOfStock}
                className="flex items-center gap-1 bg-[#CC0000] hover:bg-[#AA0000] disabled:bg-white/10 disabled:text-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-3 h-3" />
                {isOutOfStock ? "Ausverkauft" : "Kaufen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className={`relative bg-gradient-to-br from-[#111111] via-[#1A0000] to-[#0D0D0D] py-16 overflow-hidden ${className}`}>
      {/* Subtle texture dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }} />
      {/* Red glow top-right */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#CC0000]/10 blur-[100px] pointer-events-none" />
      {/* Red glow bottom-left */}
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#CC0000]/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">

          {/* LEFT — Hero text + stats */}
          <div className="lg:pt-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#CC0000] mb-3">
              Produktfinder
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-5">
              Finde deine<br />
              <span className="text-[#CC0000]">perfekte Sauce</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-10 max-w-sm">
              Wähle deinen Schärfegrad und entdecke die passenden Saucen — von mild bis zum Feuerinferno.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "200+", label: "Saucen" },
                { value: "5", label: "Schärfegrade" },
                { value: "100%", label: "Schweizer Shop" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/8 rounded-2xl px-4 py-4 text-center"
                >
                  <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                  <div className="text-white/40 text-[11px] font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Decorative flame row */}
            <div className="mt-8 flex items-center gap-2">
              {[1,2,3,4,5].map((n) => (
                <Flame
                  key={n}
                  className="w-5 h-5 transition-all duration-300"
                  style={{
                    color: n <= selectedHeatLevel ? "#CC0000" : "rgba(255,255,255,0.12)",
                    fill: n <= selectedHeatLevel ? "#CC0000" : "rgba(255,255,255,0.08)",
                    transform: n === selectedHeatLevel ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
              <span className="ml-2 text-white/30 text-xs font-medium">Level {selectedHeatLevel}</span>
            </div>
          </div>

          {/* RIGHT — Thermometer + results */}
          <div>
            {/* Loading */}
            {loading && (
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12 text-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-[#CC0000] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-white/50">Produkte werden geladen…</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12 text-center">
                <Flame className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="font-bold text-white mb-1">Fehler beim Laden</p>
                <p className="text-sm text-white/50 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 bg-[#CC0000] hover:bg-[#AA0000] text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Erneut versuchen
                </button>
              </div>
            )}

            {/* Fire Thermometer */}
            {!loading && !error && (
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-1 mb-4">
                <FireThermometer
                  onHeatLevelChange={handleHeatLevelChange}
                  onProductRecommend={handleProductRecommend}
                  products={apiProducts.length > 0 ? apiProducts : products}
                />
              </div>
            )}

            {/* Recommendations */}
            {!loading && !error && showRecommendations && (
              <div>
                {/* Count pill */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-[#CC0000]/15 text-[#FF6666] border border-[#CC0000]/25 text-xs font-bold px-3 py-1 rounded-full">
                    <Flame className="w-3 h-3 fill-[#FF6666]" />
                    {recommendedProducts.length}{" "}
                    {recommendedProducts.length === 1 ? "Sauce" : "Saucen"} gefunden
                  </span>
                </div>

                {recommendedProducts.length > 0 ? (
                  <div className="grid gap-2.5">
                    {recommendedProducts.map((product, index) =>
                      renderProductCard(product, index)
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
                    <Thermometer className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="font-bold text-white mb-1">
                      Keine Saucen für diesen Schärfegrad
                    </p>
                    <p className="text-sm text-white/40">
                      Versuche einen anderen Level oder schau später nochmal vorbei.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
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
    </section>
  )
}
