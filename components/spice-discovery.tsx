"use client"

import { useState, useEffect, useCallback } from "react"
import { Flame, ShoppingCart } from "lucide-react"
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
        className={`group bg-white rounded-2xl border border-[#EBEBEB] hover:border-[#D5D5D5] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${
          showRecommendations ? "animate-slide-up" : "opacity-0"
        }`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="p-4 flex gap-3.5">
          {/* Image */}
          <div className="relative w-[68px] h-[68px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F8F8F8]">
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
            <h4 className="font-bold text-[#1A1A1A] text-sm leading-tight line-clamp-1 mb-1 group-hover:text-[#CC0000] transition-colors">
              {product.name}
            </h4>
            <p className="text-[#888] text-xs line-clamp-2 leading-relaxed mb-2.5">
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
                className="flex items-center gap-1 bg-[#CC0000] hover:bg-[#AA0000] disabled:bg-[#D5D5D5] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
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
    <section className="bg-[#F0F1F3] border-t border-[#E0E0E0] py-12">
      <div className={`container mx-auto px-4 ${className}`}>

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#CC0000] mb-1">
              Produktfinder
            </p>
            <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
              Finde deine perfekte Sauce
            </h2>
            <p className="text-sm text-[#888] mt-1">
              Wähle den Schärfegrad und entdecke die passenden Saucen.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-10 text-center shadow-sm">
            <div className="w-10 h-10 border-2 border-[#F0F1F3] border-t-[#CC0000] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#888]">Produkte werden geladen…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-10 text-center shadow-sm">
            <Flame className="w-10 h-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="font-bold text-[#1A1A1A] mb-1">Fehler beim Laden</p>
            <p className="text-sm text-[#888] mb-4">{error}</p>
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
          <FireThermometer
            onHeatLevelChange={handleHeatLevelChange}
            onProductRecommend={handleProductRecommend}
            products={apiProducts.length > 0 ? apiProducts : products}
          />
        )}

        {/* Recommendations */}
        {!loading && !error && showRecommendations && (
          <div className="mt-6">
            {/* Count */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[#CC0000]/8 text-[#CC0000] border border-[#CC0000]/20 text-xs font-bold px-3 py-1 rounded-full">
                <Flame className="w-3 h-3 fill-[#CC0000]" />
                {recommendedProducts.length}{" "}
                {recommendedProducts.length === 1 ? "Sauce" : "Saucen"} gefunden
              </span>
            </div>

            {recommendedProducts.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {recommendedProducts.map((product, index) =>
                  renderProductCard(product, index)
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center shadow-sm">
                <Flame className="w-10 h-10 text-[#E0E0E0] mx-auto mb-3" />
                <p className="font-bold text-[#1A1A1A] mb-1">
                  Keine Saucen für diesen Schärfegrad
                </p>
                <p className="text-sm text-[#888]">
                  Versuche einen anderen Level oder schau später nochmal vorbei.
                </p>
              </div>
            )}
          </div>
        )}
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
