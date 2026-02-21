"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ShoppingCart, ChevronLeft, ChevronRight,
  Search, SlidersHorizontal, X, Check, MapPin,
  ArrowUp, ChevronDown
} from "lucide-react"
import { ShoppingCartComponent } from "./shopping-cart"
import { CheckoutPage } from "@/components/checkout-page"
import { LoginAuth } from "./login-auth"
import { ProductImage } from "./product-image"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number; name: string; description: string; price: number
  image_url?: string; image_urls?: (string | null)[]; image_url_candidates?: string[]
  heat_level: number; rating: number; badge: string
  origin: string; supplier?: string; category?: string; stock?: number
}
interface CartItem {
  id: number; name: string; price: number; image: string; image_url?: string
  description: string; heatLevel: number; rating: number
  badge?: string; origin?: string; quantity: number
}
interface Category { id: number; slug: string; name: string }

// ─── Standalone helpers ────────────────────────────────────────────────────────

function getImages(p: Product): string[] {
  return (p.image_urls ?? [p.image_url]).filter((u): u is string => !!u)
}

// ─── ProductCard (defined OUTSIDE ShopGrid so memo() actually works) ──────────

interface ProductCardProps {
  product: Product
  addedIds: Set<number>
  onSelect: (p: Product) => void
  onAddToCart: (p: Product) => void
}

const ProductCard = memo(function ProductCard({ product, addedIds, onSelect, onAddToCart }: ProductCardProps) {
  const [idx, setIdx] = useState(0)
  const images  = getImages(product)
  const inStock = (product.stock ?? 0) > 0
  const isAdded = addedIds.has(product.id)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#EBEBEB] hover:border-[#D5D5D5]">
      {/* Image */}
      <div
        className="relative aspect-square bg-[#F8F8F8] overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        {images.length > 0 ? (
          <img
            src={images[idx]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            onError={() => {
              if (idx < images.length - 1) setIdx(i => i + 1)
              else {
                const el = document.querySelector(`[data-pid="${product.id}"] img`) as HTMLImageElement
                if (el) el.src = "/placeholder.svg?height=300&width=300"
              }
            }}
          />
        ) : (
          <ProductImage
            src={product.image_url}
            candidates={product.image_url_candidates}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#333]" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#333]" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
              ))}
            </div>
          </>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[#1A1A1A]/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">Ausverkauft</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#2C5F2E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] font-bold text-[#BBBBBB] uppercase tracking-widest truncate">
          {product.supplier || product.origin || "—"}
        </p>
        <h3
          className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug cursor-pointer hover:text-[#2C5F2E] transition-colors"
          onClick={() => onSelect(product)}
        >
          {product.name}
        </h3>
        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2 border-t border-[#F5F5F5]">
          <span className="text-base font-black text-[#1A1A1A] tracking-tight">CHF {product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all duration-200 ${
              isAdded
                ? "bg-emerald-500 text-white"
                : inStock
                  ? "bg-[#2C5F2E] hover:bg-[#1A4520] text-white hover:shadow-md active:scale-95"
                  : "bg-[#F0F0F0] text-[#CCC] cursor-not-allowed"
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {isAdded ? "✓" : "Kaufen"}
          </button>
        </div>
      </div>
    </div>
  )
})

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopGrid() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts]     = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState("")

  const [search, setSearch]                 = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [stockFilter, setStockFilter]       = useState<"all" | "out_of_stock">("all")
  const [sortBy, setSortBy]                 = useState<"default"|"name_asc"|"name_desc"|"price_asc"|"price_desc">("default")
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [showBackTop, setShowBackTop]       = useState(false)

  const PAGE_SIZE = 20
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const [cart, setCart]           = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]   = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [addedIds, setAddedIds]   = useState<Set<number>>(new Set())
  const [currentView, setCurrentView] = useState<"products"|"checkout">("products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => { loadProducts(); loadCategories(); loadCart() }, [])
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [search, activeCategory, stockFilter, sortBy])

  // Apply category filter from URL param once categories are loaded
  useEffect(() => {
    const catParam = searchParams.get("cat")
    if (!catParam || categories.length === 0) return
    // Match against category name (API names like "Messer 2026" contain the display name)
    const matched = categories.find((c) =>
      c.name.toLowerCase().includes(catParam.toLowerCase())
    )
    if (matched) setActiveCategory(matched.slug)
  }, [categories, searchParams])

  // Open product detail modal from URL param (e.g. ?product=123)
  useEffect(() => {
    const productParam = searchParams.get("product")
    if (!productParam || products.length === 0) return
    const productId = parseInt(productParam, 10)
    const found = products.find((p) => p.id === productId)
    if (found) setSelectedProduct(found)
  }, [products, searchParams])
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 500)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products`)
      const data = await res.json()
      if (data.success) setProducts(data.products)
      else throw new Error(data.error)
    } catch (e: any) { setError(e.message || "Fehler") }
    finally { setLoading(false) }
  }
  const loadCategories = async () => {
    try {
      const res = await fetch(`/api/categories`)
      const data = await res.json()
      if (data.success) setCategories(data.categories)
    } catch {}
  }
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cantina-cart")
      if (saved) {
        const data: CartItem[] = JSON.parse(saved)
        setCart(data); setCartCount(data.reduce((s, i) => s + i.quantity, 0))
        setAddedIds(new Set(data.map(i => i.id)))
      }
    } catch {}
  }
  const saveCart = (c: CartItem[]) => {
    localStorage.setItem("cantina-cart", JSON.stringify(c))
    localStorage.setItem("cantina-cart-count", c.reduce((s, i) => s + i.quantity, 0).toString())
  }
  const addToCart = (product: Product) => {
    if ((product.stock ?? 0) === 0) return
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      const next = exists
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, {
            id: product.id, name: product.name, price: product.price,
            image: getImages(product)[0] ?? "/placeholder.svg",
            image_url: getImages(product)[0], description: product.description,
            heatLevel: product.heat_level, rating: product.rating,
            badge: product.badge, origin: product.origin, quantity: 1,
          }]
      saveCart(next); setCartCount(next.reduce((s, i) => s + i.quantity, 0))
      return next
    })
    setAddedIds(prev => new Set([...prev, product.id]))
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s }), 2000)
  }
  const removeFromCart = (id: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id)
      const next = item && item.quantity > 1
        ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
        : prev.filter(i => i.id !== id)
      saveCart(next); setCartCount(next.reduce((s, i) => s + i.quantity, 0))
      return next
    })
  }
  const clearCart = () => {
    setCart([]); setCartCount(0)
    localStorage.removeItem("cantina-cart"); localStorage.removeItem("cantina-cart-count")
  }
  const filtered = products
    .filter(p => {
      const matchSearch   = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === "all" || p.category === activeCategory
      const matchStock    = stockFilter === "out_of_stock" ? (p.stock ?? 0) === 0 : (p.stock ?? 0) > 0
      return matchSearch && matchCategory && matchStock
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":   return a.name.localeCompare(b.name)
        case "name_desc":  return b.name.localeCompare(a.name)
        case "price_asc":  return a.price - b.price
        case "price_desc": return b.price - a.price
        default: return 0
      }
    })

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleSelect   = useCallback((p: Product) => setSelectedProduct(p), [])
  const handleAddToCart = useCallback((p: Product) => addToCart(p), [addedIds, cart]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Detail Modal ─────────────────────────────────────────────────────────
  const DetailModal = ({ product }: { product: Product }) => {
    const images  = getImages(product)
    const [idx, setIdx] = useState(0)
    const inStock = (product.stock ?? 0) > 0
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
        <div className="bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Handle bar mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 pr-4 line-clamp-1">{product.name}</h2>
            <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 p-6 flex flex-col items-center">
              {images.length > 0 ? (
                <img
                  src={images[idx]}
                  alt={product.name}
                  className="w-full max-w-xs aspect-square object-contain"
                  onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400" }}
                />
              ) : (
                <ProductImage
                  src={product.image_url}
                  candidates={product.image_url_candidates}
                  alt={product.name}
                  className="w-full max-w-xs aspect-square object-contain"
                />
              )}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {images.map((url, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === idx ? "border-gray-900 scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={url} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.supplier || product.origin}</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              {product.origin && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.origin}</span>
                </div>
              )}
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                {inStock ? `Auf Lager · ${product.stock} Stück` : "Nicht verfügbar"}
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-400">CHF</span>
                </div>
                <button
                  onClick={() => { addToCart(product); setSelectedProduct(null) }}
                  disabled={!inStock}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    inStock ? "bg-[#2C5F2E] hover:bg-[#1A4520] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#2C5F2E]/20" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? "In den Warenkorb" : "Ausverkauft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Views ────────────────────────────────────────────────────────────────
  if (currentView === "checkout") {
    return <CheckoutPage cart={cart} onBackToStore={() => setCurrentView("products")} onClearCart={clearCart} onAddToCart={(p: any) => addToCart(p)} onRemoveFromCart={removeFromCart} />
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-4 bg-gray-100 rounded-full w-5/6" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">{error}</p>
          <button onClick={loadProducts} className="text-sm font-medium text-gray-600 underline">Erneut versuchen</button>
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <ShoppingCartComponent
        isOpen={cartOpen} onOpenChange={setCartOpen} cart={cart}
        onAddToCart={(p: any) => addToCart(p)} onRemoveFromCart={removeFromCart}
        onGoToCheckout={() => { setCartOpen(false); setCurrentView("checkout") }}
        onClearCart={clearCart}
      />


      {/* Back to top */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-5 z-40 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-3 shadow-xl border border-gray-200 transition-all hover:scale-110 active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {selectedProduct && <DetailModal product={selectedProduct} />}

      <div className="min-h-screen bg-[#f7f7f8]">

        {/* ── Top bar ── */}
        <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

            {/* ← Home button */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#555] hover:text-[#2C5F2E] transition-colors group flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-full border border-[#E5E5E5] group-hover:border-[#2C5F2E]/60 group-hover:bg-[#2C5F2E]/5 flex items-center justify-center transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold hidden sm:block">Home</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-[#E5E5E5] flex-shrink-0" />

            {/* Logo */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <img src="/Security_n.png" alt="Logo" className="h-12 w-auto object-contain" />
            </div>

            <div className="hidden md:block w-px h-6 bg-[#E5E5E5] flex-shrink-0" />

            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              <input
                type="text"
                placeholder="Produkte suchen…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F3F4F6] rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-[#2C5F2E] focus:ring-2 focus:ring-[#2C5F2E]/10 transition-all placeholder-[#9CA3AF]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-[#999] font-semibold hidden lg:block whitespace-nowrap">
              <span className="text-[#1A1A1A] font-black">{filtered.length}</span> Produkte
            </span>

            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] bg-[#F3F4F6] hover:bg-[#E8E9EB] px-4 py-2 rounded-full transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>

            {/* Login — header style */}
            <div className="flex flex-col items-center min-w-[56px]">
              <LoginAuth
                onLoginSuccess={() => {}}
                onLogout={() => {}}
                onShowProfile={() => {}}
                isLightSection={true}
                variant="button"
              />
            </div>

            {/* Cart icon — header style */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex flex-col items-center p-2 hover:bg-[#F5F5F5] rounded-xl transition-colors flex-shrink-0"
            >
              <ShoppingCart className="w-5 h-5 text-[#555]" />
              <span className="text-[10px] text-[#555] mt-0.5 leading-none">Warenkorb</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#CC0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">

          {/* ── Sidebar ── */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-52 xl:w-60 flex-shrink-0 lg:sticky lg:top-20 lg:self-start`}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EBEBEB] space-y-5">

              <div>
                <p className="text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.15em] mb-3">Kategorien</p>
                <ul className="space-y-0.5">
                  {[{ slug: "all", name: "Alle" }, ...categories].map(cat => {
                    const count = cat.slug === "all" ? products.filter(p => (p.stock ?? 0) > 0).length : products.filter(p => p.category === cat.slug).length
                    const isActive = activeCategory === cat.slug
                    return (
                      <li key={cat.slug}>
                        <button
                          onClick={() => setActiveCategory(prev => prev === cat.slug ? "all" : cat.slug)}
                          className={`w-full text-left flex items-center justify-between text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                            isActive
                              ? "bg-[#2C5F2E] text-white shadow-sm"
                              : "text-[#555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
                          }`}
                        >
                          <span className="truncate">{cat.name.replace(/\s*\d{4}$/, "")}</span>
                          <span className={`text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded-full flex-shrink-0 ${isActive ? "bg-white/25 text-white" : "bg-[#F0F0F0] text-[#888]"}`}>{count}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="border-t border-[#F3F3F3] pt-4">
                <p className="text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.15em] mb-3">Verfügbarkeit</p>
                <ul className="space-y-0.5">
                  {([["all", "Auf Lager"], ["out_of_stock", "Ausverkauft"]] as const).map(([val, label]) => (
                    <li key={val}>
                      <button
                        onClick={() => setStockFilter(val)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all font-medium ${
                          stockFilter === val ? "bg-[#2C5F2E] text-white shadow-sm" : "text-[#555] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {(activeCategory !== "all" || stockFilter !== "all" || search) && (
                <button
                  onClick={() => { setActiveCategory("all"); setStockFilter("all"); setSearch("") }}
                  className="w-full text-xs font-semibold text-[#CC0000]/70 hover:text-[#CC0000] transition-colors text-left flex items-center gap-1.5 pt-1"
                >
                  <X className="w-3 h-3" /> Filter zurücksetzen
                </button>
              )}
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0">

            {/* ── Category image banners — desktop only ── */}
            {(() => {
              const CAT_IMAGES: Record<string, string> = {
                "zubeh":     "/images/categories/Armbrust%20Zubeh%C3%B6r026.jpg",
                "armbrust":  "/images/categories/Armbrust.jpg",
                "messer":    "/images/categories/m%20esser2026_n.jpg",
                "beil":      "/images/categories/Beil.jpg",
                "lampen":    "/images/categories/Lampen2026.jpg",
                "schleuder": "/images/categories/Schleuder.png",
                "security":  "/images/categories/Security.jpg",
                "pfeilbogen":"https://www.bogensportwelt.ch/media/image/product/174716/lg/drake-black-raven-58-zoll-30-lbs-take-down-recurvebogen.webp",
                "rauch":     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop&auto=format",
                "grill":     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop&auto=format",
              }
              const getCatImg = (name: string, slug: string) => {
                const key = Object.keys(CAT_IMAGES).find(k =>
                  name.toLowerCase().includes(k) || slug.toLowerCase().includes(k)
                )
                return key ? CAT_IMAGES[key] : null
              }
              return (
                <div className="hidden lg:grid grid-cols-3 gap-2 mb-6">
                  {/* Category image cards */}
                  {categories.map(cat => {
                    const img = getCatImg(cat.name, cat.slug)
                    const isActive = activeCategory === cat.slug
                    const displayName = cat.name.replace(/\s*\d{4}$/, "")
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => setActiveCategory(prev => prev === cat.slug ? "all" : cat.slug)}
                        className={`relative overflow-hidden rounded-xl group transition-all duration-300 ${isActive ? "ring-2 ring-[#2C5F2E] ring-offset-1 shadow-lg" : "hover:shadow-md"}`}
                        style={{ height: "90px", backgroundColor: "#1a1a1a" }}
                      >
                        {img && (
                          <img
                            src={img}
                            alt={displayName}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                        )}
                        <div className={`absolute inset-0 transition-all duration-300 ${isActive ? "bg-[#2C5F2E]/60" : "bg-black/55 group-hover:bg-black/40"}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-white/90 backdrop-blur-md text-[#1A1A1A] font-black text-sm leading-none px-4 py-2 rounded-full shadow-lg border border-white/60 group-hover:bg-white transition-colors duration-200">
                            {displayName}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#2C5F2E] rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })()}

            {/* ── Category pills — mobile only ── */}
            <div className="lg:hidden overflow-x-auto mb-5 -mx-1 px-1">
              <div className="flex gap-2 min-w-max pb-1">
                {[{ slug: "all", name: "Alle" }, ...categories].map(cat => {
                  const isActive = activeCategory === cat.slug
                  const displayName = cat.name.replace(/\s*\d{4}$/, "")
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(prev => prev === cat.slug ? "all" : cat.slug)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#2C5F2E] text-white shadow-md shadow-[#2C5F2E]/25"
                          : "bg-white text-[#555] hover:bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#CCC]"
                      }`}
                    >
                      {displayName}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort + count */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-sm text-[#888] font-medium">
                <span className="font-black text-[#1A1A1A]">{filtered.length}</span> Produkte
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none text-sm font-semibold text-[#555] bg-white border border-[#E5E5E5] rounded-full pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C5F2E]/20 cursor-pointer"
                >
                  <option value="default">Empfehlung</option>
                  <option value="name_asc">Name A–Z</option>
                  <option value="name_desc">Name Z–A</option>
                  <option value="price_asc">Preis ↑</option>
                  <option value="price_desc">Preis ↓</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA] pointer-events-none" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-lg font-bold text-gray-300 mb-3">Keine Produkte gefunden</p>
                <button onClick={() => { setSearch(""); setActiveCategory("all"); setStockFilter("all") }} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {visibleProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addedIds={addedIds}
                      onSelect={handleSelect}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white hover:bg-[#2C5F2E] hover:text-white text-[#1A1A1A] border-2 border-[#2C5F2E]/25 hover:border-[#2C5F2E] rounded-full text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#2C5F2E]/15 active:scale-[0.98]"
                    >
                      Mehr laden
                      <span className="bg-[#2C5F2E]/10 text-[#2C5F2E] text-xs font-black px-2.5 py-0.5 rounded-full">
                        +{filtered.length - visibleCount}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
