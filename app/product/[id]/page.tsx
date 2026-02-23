"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ChevronLeft, ShoppingCart, Check, MapPin } from "lucide-react"
import { ProductImage } from "@/components/product-image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  image_urls?: (string | null)[]
  image_url_candidates?: string[]
  badge?: string
  origin?: string
  supplier?: string
  category?: string
  stock?: number
}

interface CartItem {
  id: number; name: string; price: number; image: string; image_url?: string
  description: string; heatLevel: number; rating: number
  badge?: string; origin?: string; quantity: number
}

function getImages(p: Product): string[] {
  return (p.image_urls ?? [p.image_url]).filter((u): u is string => !!u)
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const backTo = searchParams.get("back")

  const [product, setProduct] = useState<Product | null>(null)
  const [similar, setSimilar] = useState<Product[]>([])
  const [failedSimilar, setFailedSimilar] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cantina-cart")
      if (saved) {
        const items: CartItem[] = JSON.parse(saved)
        setCartCount(items.reduce((s, i) => s + i.quantity, 0))
      }
    } catch {}
  }, [added])

  const markSimilarFailed = (id: number) =>
    setFailedSimilar(prev => new Set([...prev, id]))

  useEffect(() => {
    setImgIdx(0)
    setProduct(null)
    setSimilar([])
    setFailedSimilar(new Set())
    setLoading(true)
    setError("")

    fetch(`/api/products?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.product) {
          setProduct(data.product)
          // Fetch similar from cache (no extra PHP call)
          fetch("/api/products")
            .then(r => r.json())
            .then(all => {
              if (!all.success) return
              const cat = data.product.category
              const hasImage = (p: Product) =>
                getImages(p).length > 0 || !!(p.image_url) || !!(p.image_url_candidates?.length)
              const others: Product[] = all.products.filter(
                (p: Product) => p.id !== data.product.id && p.category === cat && (p.stock ?? 0) > 0 && hasImage(p)
              )
              setSimilar(others.slice(0, 10))
            })
            .catch(() => {})
        } else {
          setError("Produkt nicht gefunden")
        }
      })
      .catch(() => setError("Verbindungsfehler"))
      .finally(() => setLoading(false))
  }, [id])

  const addToCart = () => {
    if (!product) return
    try {
      const saved = localStorage.getItem("cantina-cart")
      const cart: CartItem[] = saved ? JSON.parse(saved) : []
      const images = getImages(product)
      const exists = cart.find(i => i.id === product.id)
      const next = exists
        ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...cart, {
            id: product.id, name: product.name, price: product.price,
            image: images[0] ?? "/placeholder.svg",
            image_url: images[0],
            image_url_candidates: product.image_url_candidates,
            description: product.description,
            heatLevel: 0, rating: 0,
            badge: product.badge, origin: product.origin, quantity: 1,
          }]
      localStorage.setItem("cantina-cart", JSON.stringify(next))
      localStorage.setItem("cantina-cart-count", next.reduce((s, i) => s + i.quantity, 0).toString())
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {}
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="bg-white border-b border-[#E0E0E0] h-14 animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-[#EBEBEB] overflow-hidden animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-100 aspect-square" />
            <div className="p-8 flex flex-col gap-4">
              <div className="h-3 w-24 bg-gray-100 rounded-full" />
              <div className="h-8 w-4/5 bg-gray-200 rounded-full" />
              <div className="h-6 w-32 bg-gray-100 rounded-full" />
              <div className="h-28 bg-gray-100 rounded-2xl" />
              <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                <div className="h-8 w-32 bg-gray-200 rounded-full" />
                <div className="h-14 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-[#666] font-semibold">{error || "Produkt nicht gefunden"}</p>
      <button onClick={() => backTo ? router.push(`/${backTo}`) : router.back()} className="text-sm text-[#2C5F2E] font-bold underline">
        Zurück
      </button>
    </div>
  )

  const images = getImages(product)
  const inStock = (product.stock ?? 0) > 0

  return (
    <div className="min-h-screen bg-[#F7F7F8]">

      {/* Header */}
      <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => backTo ? router.push(`/${backTo}`) : router.back()}
            className="flex items-center gap-2 text-[#555] hover:text-[#2C5F2E] transition-colors group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#E5E5E5] group-hover:border-[#2C5F2E]/60 group-hover:bg-[#2C5F2E]/5 flex items-center justify-center transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold hidden sm:block">Zurück</span>
          </button>
          <div className="w-px h-6 bg-[#E5E5E5] flex-shrink-0" />
          <p className="text-sm font-semibold text-[#1A1A1A] truncate">{product.name}</p>
          <button
            onClick={() => router.push("/?checkout=true")}
            className="ml-auto relative flex items-center justify-center w-10 h-10 hover:bg-[#F5F5F5] rounded-xl transition-colors flex-shrink-0"
          >
            <ShoppingCart className="w-5 h-5 text-[#555]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#CC0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-[#EBEBEB] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image side */}
            <div className="bg-[#F8F8F8] p-6 flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-[#F0F0F0]">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
                {images.length > 0 ? (
                  <img
                    src={images[imgIdx]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400" }}
                  />
                ) : (
                  <ProductImage
                    src={product.image_url}
                    candidates={product.image_url_candidates}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#2C5F2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-[#1A1A1A]/80 text-white text-sm font-bold px-4 py-2 rounded-full">
                      Ausverkauft
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        i === imgIdx
                          ? "border-[#2C5F2E] shadow-md scale-105"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="p-6 md:p-8 flex flex-col gap-4">

              {(product.supplier || product.origin) && (() => {
                const BRAND_COLORS: Record<string, string> = {
                  "AIRSOFT":      "text-[#1A1A1A]",
                  "BLACK FLASH":  "text-[#333]",
                  "BLACKFLASH":   "text-[#1A1A1A]",
                  "BÖKER":        "text-[#8B0000]",
                  "FISHERMAN'S":  "text-[#1A5276]",
                  "HALLER":       "text-[#2C5F2E]",
                  "JENZI":        "text-[#FF6600]",
                  "LINDER":       "text-[#333]",
                  "NATURZONE":    "text-[#2C5F2E]",
                  "POHLFORCE":    "text-[#CC0000]",
                  "SMOKI":        "text-[#8B6914]",
                  "STEAMBOW":     "text-[#1A1A8C]",
                  "SYTONG":       "text-[#003087]",
                  "WILTEC":       "text-[#555]",
                }
                const label = (product.supplier || product.origin || "").toUpperCase()
                const color = BRAND_COLORS[label] ?? "text-[#888]"
                return (
                  <p className={`text-sm font-black uppercase tracking-widest ${color}`}>
                    {label}
                  </p>
                )
              })()}

              <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${
                inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                {inStock ? `Auf Lager · ${product.stock} Stück` : "Nicht verfügbar"}
              </div>

              {product.description && (
                <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#F0F0F0]">
                  <p className="text-[11px] font-bold text-[#BBBBBB] uppercase tracking-widest mb-2">
                    Beschreibung
                  </p>
                  <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {product.origin && (
                <div className="flex items-center gap-1.5 text-xs text-[#999]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.origin}</span>
                </div>
              )}

              {/* Price + CTA */}
              <div className="mt-auto pt-5 border-t border-[#F0F0F0]">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[#1A1A1A] tracking-tight">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-base text-[#999] font-medium">CHF</span>
                </div>
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    added
                      ? "bg-emerald-500 text-white"
                      : inStock
                        ? "bg-[#2C5F2E] hover:bg-[#1A4520] text-white shadow-lg shadow-[#2C5F2E]/20 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {added ? "Hinzugefügt!" : inStock ? "In den Warenkorb" : "Ausverkauft"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Similar products */}
      {(() => {
        const visible = similar.filter(p => !failedSimilar.has(p.id)).slice(0, 4)
        if (visible.length === 0) return null
        return (
          <div className="max-w-5xl mx-auto px-4 pb-10">
            <div className="border-t border-[#E8E8E8] pt-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-[#2C5F2E] rounded-full" />
                <h2 className="text-base font-black text-[#1A1A1A] tracking-tight">Ähnliche Produkte</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {visible.map(p => {
                  const imgs = getImages(p)
                  return (
                    <div
                      key={p.id}
                      onClick={() => router.replace(`/product/${p.id}?back=shop`)}
                      className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="aspect-square bg-[#F8F8F8] overflow-hidden">
                        {imgs.length > 0 ? (
                          <img
                            src={imgs[0]}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => markSimilarFailed(p.id)}
                          />
                        ) : (
                          <ProductImage
                            src={p.image_url}
                            candidates={p.image_url_candidates}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onAllFailed={() => markSimilarFailed(p.id)}
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-[#1A1A1A] line-clamp-2 leading-tight mb-1">
                          {p.name}
                        </p>
                        <p className="text-sm font-black text-[#2C5F2E]">
                          CHF {p.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Trust badges */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "100% Schweizer Shop",
            "Schnelle Lieferung",
            "14 Tage Rückgaberecht",
            "500+ Artikel im Sortiment",
          ].map((feat) => (
            <div
              key={feat}
              className="flex items-center gap-2 bg-white border border-[#E8E8E8] rounded-full px-4 py-2 shadow-sm"
            >
              <span className="w-5 h-5 rounded-full bg-[#2C5F2E] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </span>
              <span className="text-xs font-semibold text-[#333]">{feat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
