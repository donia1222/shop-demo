"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  price: number
  image_url?: string
  image_urls?: (string | null)[]
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

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    Promise.all([
      fetch(`${API}/get_products.php`).then((r) => r.json()),
      fetch(`${API}/get_categories.php`, { method: "POST" }).then((r) => r.json()),
    ])
      .then(([prodData, catData]) => {
        if (prodData.success) setProducts(prodData.products)
        if (catData.success) setCategories(catData.categories)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  const sections = CATEGORY_CONFIG.flatMap(({ keyword, label, cat }) => {
    const apiCat = categories.find((c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    )
    if (!apiCat) return []

    const catProducts = products
      .filter((p) => p.category === apiCat.slug && (p.stock ?? 1) > 0)
      .slice(0, 6)

    if (catProducts.length === 0) return []

    return [{ label, cat, products: catProducts }]
  })

  if (sections.length === 0) return null

  return (
    <div className="bg-gradient-to-b from-[#F0F1F3] to-[#FAFAFA] border-t border-[#E0E0E0] py-12">
      <div className="container mx-auto px-4 space-y-6">
        {sections.map(({ label, cat, products: catProducts }) => (
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

            {/* 6 product cards */}
            <div className="p-5 grid grid-cols-3 sm:grid-cols-6 gap-4">
              {catProducts.map((product) => {
                const img =
                  product.image_urls?.find((u) => !!u) ||
                  product.image_url ||
                  "/placeholder.svg"
                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/shop?product=${product.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-[#F8F8F8] rounded-xl overflow-hidden aspect-square border border-[#EFEFEF] group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                      <img
                        src={img as string}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
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
        ))}

        {/* ── Angeln & Fischen Banner ── */}
        <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "360px" }}>
          {/* Deep background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#040f1c] via-[#0a1a2e] to-[#0d2340]" />

          {/* Background image grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5 opacity-20">
            {[
              "/images/fischen/472679633_1183608080203417_7913441867178334031_n.jpg",
              "/images/fischen/488932258_1259588225938735_6410340367577521871_n.jpg",
              "/images/fischen/502738911_2659264294424381_7610663104337844293_n.jpg",
              "/images/fischen/502954352_2659264274424383_4010680107724982762_n.jpg",
              "/images/fischen/503264101_2659264021091075_8537894800997994009_n.jpg",
              "/images/fischen/589527302_1466241405273415_5787096142363867948_n.jpg",
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-full object-cover" />
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040f1c]/98 via-[#0a1a2e]/80 to-transparent" />

          {/* Ambient glow */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#1A6B8A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 bottom-0 w-64 h-32 bg-[#1A6B8A]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Text content */}
          <div className="relative z-10 flex items-center h-full p-8 md:p-14" style={{ minHeight: "360px" }}>
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 bg-[#1A6B8A]/25 backdrop-blur-sm text-[#5BC8E8] border border-[#1A6B8A]/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#5BC8E8] rounded-full animate-pulse" />
                Angeln & Fischen
              </span>
              <h2
                className="text-white font-black leading-tight mb-4"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)", letterSpacing: "-0.02em" }}
              >
                Alles für den<br />
                <span className="text-[#5BC8E8]">perfekten Angeltag</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base mb-8 leading-relaxed">
                Ruten, Rollen, Köder und Zubehör —<br />
                Top-Qualität für Angler aller Niveaus.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/shop")}
                  className="bg-white text-[#0a1a2e] font-bold px-7 py-3 text-sm hover:bg-[#e8f4f8] transition-all rounded-full inline-flex items-center gap-2 shadow-lg"
                >
                  Jetzt entdecken <span>→</span>
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="border border-white/20 hover:border-white/45 text-white/70 hover:text-white font-medium px-6 py-3 text-sm rounded-full transition-all"
                >
                  Alle Angebote
                </button>
              </div>
            </div>
          </div>

          {/* Right: featured fishing photo — desktop only */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block pointer-events-none">
            <img
              src="/images/fischen/132081708_1370015766682580_118186262331184813_n.jpg"
              alt="Angeln & Fischen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0a1a2e]/15 to-[#040f1c]/92" />
          </div>
        </div>

      </div>
    </div>
  )
}
