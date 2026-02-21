"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductImage } from "./product-image"

interface Product {
  id: number
  name: string
  price: number
  image_url?: string
  image_urls?: (string | null)[]
  image_url_candidates?: string[]
  category?: string
  stock?: number
}

interface Category {
  id: number
  slug: string
  name: string
}

const CATEGORY_CONFIG = [
  { keyword: "Messer",   label: "Unsere Messer",   cat: "Messer" },
  { keyword: "Armbrust", label: "Unsere Armbrüste", cat: "Armbrust" },
]

export function CategoryPreviewSection() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set())

  const markFailed = (id: number) =>
    setFailedIds(prev => new Set([...prev, id]))

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    let cancelled = false

    const load = async (retries = 3): Promise<void> => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${API}/get_products.php`),
          fetch(`${API}/get_categories.php`, { method: "POST" }),
        ])
        if (!r1.ok || !r2.ok) throw new Error("not ok")
        const [prodData, catData] = await Promise.all([r1.json(), r2.json()])
        if (cancelled) return
        if (prodData.success) setProducts(prodData.products)
        if (catData.success) setCategories(catData.categories)
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

  if (loading) return null

  const sections = CATEGORY_CONFIG.flatMap(({ keyword, label, cat }) => {
    const apiCat = categories.find((c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    )
    if (!apiCat) return []

    const catProducts = products
      .filter((p) => p.category === apiCat.slug && (p.stock ?? 1) > 0)
      .slice(0, 20)

    if (catProducts.length === 0) return []

    return [{ label, cat, products: catProducts }]
  })

  if (sections.length === 0) return null

  return (
    <div className="bg-gradient-to-b from-[#F0F1F3] to-[#FAFAFA] border-t border-[#E0E0E0] py-12">
      <div className="container mx-auto px-4 space-y-6">
        {sections.map(({ label, cat, products: catProducts }) => {
          const visible = catProducts.filter(p => !failedIds.has(p.id)).slice(0, 6)
          if (visible.length === 0) return null
          return (
          <div key={cat} className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-5 pb-5 flex items-center justify-between border-b border-[#F3F3F3]">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-[#2C5F2E] rounded-full flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-black text-[#1A1A1A] leading-tight tracking-tight">{label}</h2>
                  <p className="text-xs text-[#AAA] mt-0.5">Für jeden Bedarf das Richtige.</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat)}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#2C5F2E] bg-[#2C5F2E]/8 hover:bg-[#2C5F2E]/15 px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                Alle anzeigen <span>→</span>
              </button>
            </div>

            {/* 6 product cards con imagen */}
            <div className="p-5 grid grid-cols-3 sm:grid-cols-6 gap-4">
              {visible.map((product) => {
                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/shop?product=${product.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-[#F8F8F8] rounded-xl overflow-hidden aspect-square border border-[#EFEFEF] group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                      <ProductImage
                        src={product.image_url}
                        candidates={product.image_url_candidates}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onAllFailed={() => markFailed(product.id)}
                      />
                    </div>
                    <p className="text-xs text-center text-[#1A1A1A] font-semibold mt-2 leading-tight line-clamp-2 px-0.5">
                      {product.name}
                    </p>
                    {product.price > 0 && (
                      <p className="text-xs text-center text-[#2C5F2E] font-bold mt-0.5">
                        CHF {product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* CTA footer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat)}`)}
                className="w-full py-3 rounded-xl border-2 border-[#2C5F2E]/20 hover:border-[#2C5F2E] hover:bg-[#2C5F2E]/5 text-sm font-bold text-[#2C5F2E] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Mehr aus {label} entdecken <span className="text-base">→</span>
              </button>
            </div>
          </div>
          )
        })}

        {/* ── Angeln & Fischen Banner ── */}
        <div className="relative rounded-2xl overflow-hidden h-[420px] group">

          {/* Background image */}
          <img
            src="/images/fischen/472679633_1183608080203417_7913441867178334031_n.jpg"
            alt="Angeln & Fischen"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Gradient overlay: dark on left, fade to transparent on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#04111f] via-[#04111f]/80 to-[#04111f]/20" />
          {/* Bottom fade for thumbnails */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04111f]/70 via-transparent to-transparent" />

          {/* Text content — left side */}
          <div className="relative h-full flex flex-col justify-center px-10 max-w-lg gap-5">
            <span className="inline-flex items-center gap-1.5 self-start bg-[#5BC8E8]/20 text-[#5BC8E8] border border-[#5BC8E8]/40 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
              🎣 Angeln & Fischen
            </span>

            <h2 className="text-white font-black text-4xl leading-[1.1]" style={{ letterSpacing: "-0.02em" }}>
              Alles für den<br />
              <span className="text-[#5BC8E8]">perfekten Angeltag</span>
            </h2>

            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Ruten, Rollen, Köder und Zubehör — Top-Qualität für Angler aller Niveaus.
            </p>

            <div className="flex gap-7">
              {[["500+", "Produkte"], ["Top", "Qualität"], ["Gratis", "Beratung"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-white font-black text-lg leading-none">{val}</p>
                  <p className="text-white/45 text-[11px] mt-1">{lbl}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/shop")}
              className="self-start bg-[#5BC8E8] text-[#04111f] font-bold px-6 py-3 text-sm hover:bg-white transition-all duration-200 rounded-xl inline-flex items-center gap-2 shadow-xl"
            >
              Jetzt entdecken →
            </button>
          </div>


        </div>

      </div>
    </div>
  )
}
