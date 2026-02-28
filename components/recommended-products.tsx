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

  useEffect(() => {
    let cancelled = false

    const load = async (retries = 2): Promise<void> => {
      try {
        const r = await fetch(`/api/products`)
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

  if (loading) return (
    <section className="bg-[#0D0D0D] border-t border-[#1A1A1A] py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2 animate-pulse">
            <div className="h-5 w-24 bg-[#1A1A1A] rounded-full" />
            <div className="h-6 w-52 bg-[#222] rounded-full" />
            <div className="h-4 w-64 bg-[#1A1A1A] rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-[#1A1A1A] rounded-2xl mb-3" />
              <div className="h-3 bg-[#1A1A1A] rounded-full w-5/6 mb-1" />
              <div className="h-3 bg-[#1A1A1A] rounded-full w-3/4 mb-1" />
              <div className="h-4 bg-[#222] rounded-full w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (visibleProducts.length === 0) return null

  return (
    <section className="bg-[#0D0D0D] border-t border-[#1A1A1A] py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#CC0000]/10 text-[#FF4500] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full" />
              Empfohlen für dich
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Empfohlene Produkte</h2>
            <p className="text-sm text-[#666] mt-1">Handverlesene Auswahl aus unserem Sortiment.</p>
          </div>
          <button
            onClick={() => router.push("/shop")}
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#CC0000] font-semibold hover:gap-3 transition-all duration-200 whitespace-nowrap"
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
                onClick={() => router.push(`/product/${product.id}`)}
                className="cursor-pointer group"
              >
                {/* Image */}
                <div className="relative bg-[#1A1A1A] rounded-2xl overflow-hidden aspect-square mb-3 border border-[#2A2A2A] group-hover:shadow-[0_8px_30px_rgba(204,0,0,0.2)] group-hover:-translate-y-1 transition-all duration-300">
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
                    <span className="bg-[#CC0000] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Ansehen →
                    </span>
                  </div>
                </div>

                {/* Name */}
                <p className="text-xs font-semibold text-[#DDD] leading-tight line-clamp-2 mb-1.5 group-hover:text-[#FF4500] transition-colors">
                  {product.name}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-black text-white">
                    CHF {product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-[#555] line-through">
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
