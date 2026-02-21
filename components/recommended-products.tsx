"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductImage } from "./product-image"

interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  image_url?: string
  image_urls?: (string | null)[]
  image_url_candidates?: string[]
  badge?: string
  category?: string
  stock?: number
}

export function RecommendedProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  const markFailed = (id: number) =>
    setFailedIds(prev => new Set([...prev, id]))

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    let cancelled = false

    const load = async (retries = 3): Promise<void> => {
      try {
        const r = await fetch(`${API}/get_products.php`)
        if (!r.ok) throw new Error(`${r.status}`)
        const data = await r.json()
        if (!data.success || cancelled) return

        const allProducts: Product[] = data.products

        const hasImage = (p: Product) =>
          !!(p.image_url && /\.(jpg|jpeg|png|webp|gif)$/i.test(p.image_url))

        const inStock = [
          ...allProducts.filter((p) => (p.stock ?? 1) > 0 && hasImage(p)),
          ...allProducts.filter((p) => (p.stock ?? 1) > 0 && !hasImage(p)),
        ]

        const byCategory: Record<string, Product[]> = {}
        for (const p of inStock) {
          const key = p.category || "other"
          if (!byCategory[key]) byCategory[key] = []
          byCategory[key].push(p)
        }

        const selected: Product[] = []
        for (const catProducts of Object.values(byCategory)) {
          selected.push(...catProducts.slice(0, 3))
          if (selected.length >= 24) break
        }
        if (selected.length < 24) {
          const ids = new Set(selected.map((p) => p.id))
          for (const p of inStock) {
            if (!ids.has(p.id)) { selected.push(p); if (selected.length >= 24) break }
          }
        }

        setProducts(selected.slice(0, 24))
      } catch {
        if (!cancelled && retries > 0) {
          await new Promise(r => setTimeout(r, 1500))
          return load(retries - 1)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const visibleProducts = products.filter(p => !failedIds.has(p.id)).slice(0, 12)

  if (loading || visibleProducts.length === 0) return null

  return (
    <section className="bg-white border-t border-[#E0E0E0] py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#2C5F2E]/8 text-[#2C5F2E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-[#2C5F2E] rounded-full" />
              Empfohlen für dich
            </div>
            <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Empfohlene Produkte</h2>
            <p className="text-sm text-[#888] mt-1">Handverlesene Auswahl aus unserem Sortiment.</p>
          </div>
          <button
            onClick={() => router.push("/shop")}
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#2C5F2E] font-semibold hover:gap-3 transition-all duration-200 whitespace-nowrap"
          >
            Alle Produkte <span>→</span>
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleProducts.map((product) => {
            const hasDiscount =
              product.original_price && product.original_price > product.price
            const discountPct = hasDiscount
              ? Math.round(
                  ((product.original_price! - product.price) /
                    product.original_price!) *
                    100
                )
              : null

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/shop?product=${product.id}`)}
                className="cursor-pointer group"
              >
                {/* Image */}
                <div className="relative bg-[#F8F8F8] rounded-2xl overflow-hidden aspect-square mb-3 border border-[#EFEFEF] group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <ProductImage
                    src={product.image_url}
                    candidates={product.image_url_candidates}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onAllFailed={() => markFailed(product.id)}
                  />

                  {/* Badges — top left */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discountPct && (
                      <span className="bg-[#CC0000] text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none shadow-sm">
                        -{discountPct}%
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-white text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Ansehen →
                    </span>
                  </div>
                </div>

                {/* Name */}
                <p className="text-xs font-semibold text-[#1A1A1A] leading-tight line-clamp-2 mb-1.5 group-hover:text-[#2C5F2E] transition-colors">
                  {product.name}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-black text-[#1A1A1A]">
                    CHF {product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-[#BBB] line-through">
                      CHF {product.original_price!.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
