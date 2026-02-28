"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, ArrowUp, Newspaper, Download, Images } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LoginAuth } from "./login-auth"

interface Product {
  id: number
  image_url?: string
  image_urls?: (string | null)[]
  image_url_candidates?: string[]
  category?: string
}

interface Category {
  id: number
  slug: string
  name: string
}

interface HeroHeaderProps {
  onCartOpen?: () => void
  cartCount?: number
}

function getCategoryImage(catProds: Product[]): string[] {
  const urls: string[] = []
  for (const p of catProds) {
    const fromUrls = (p.image_urls ?? []).filter((u): u is string => !!u)
    urls.push(...fromUrls)
    if (p.image_url) urls.push(p.image_url)
    if (p.image_url_candidates?.length) urls.push(...p.image_url_candidates)
  }
  return [...new Set(urls)]
}

function CatImageCard({ srcs, alt, className }: { srcs: string[]; alt: string; className?: string }) {
  const [idx, setIdx] = useState(0)
  if (!srcs.length || idx >= srcs.length) return null
  return <img src={srcs[idx]} alt={alt} className={className} onError={() => setIdx((i) => i + 1)} />
}

export function HeroHeader({ onCartOpen, cartCount = 0 }: HeroHeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [count, setCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Counter animation
  useEffect(() => {
    const t = setTimeout(() => {
      const target = 500
      const steps = 50
      const interval = 1000 / steps
      let current = 0
      const timer = setInterval(() => {
        current += target / steps
        if (current >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(current))
      }, interval)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    Promise.all([fetch("/api/categories"), fetch("/api/products")])
      .then(([r1, r2]) => Promise.all([r1.json(), r2.json()]))
      .then(([catData, prodData]) => {
        if (catData.success) setCategories(catData.categories)
        if (prodData.success) setProducts(prodData.products)
      })
      .catch(() => {})
  }, [])

  const navItems = [
    { label: "Alle Produkte", href: "/shop" },
    ...categories.map((cat) => ({
      label: cat.name,
      href: `/shop?cat=${encodeURIComponent(cat.name)}`,
    })),
  ]

  const handleLoginSuccess = (_user: unknown) => {}
  const handleLogout = () => {}
  const handleShowProfile = () => { router.push("/profile"); setIsMenuOpen(false) }

  const downloadVcard = () => {
    setIsMenuOpen(false)
    const imageUrl = "https://online-shop-seven-delta.vercel.app/Security_n.png"
    const makeVcard = () => {
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Hot-Sauce Shop\nORG:Hot-Sauce Shop\nTITLE:SCHARFE SAUCEN · SCHWEIZ\nADR:;;Bahnhofstrasse 2;Sevelen;;9475;Switzerland\nTEL:+41786066105\nEMAIL:info@hot-sauce-shop.ch\nURL:https://hot-sauce-shop.ch\nEND:VCARD`
      const link = document.createElement("a")
      link.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard;charset=utf-8" }))
      link.download = "Hot-Sauce-Shop.vcf"
      document.body.appendChild(link); link.click(); document.body.removeChild(link)
    }
    fetch(imageUrl)
      .then((res) => { if (!res.ok) throw new Error(res.statusText); return res.blob() })
      .then((blob) => {
        const reader = new FileReader()
        reader.onloadend = makeVcard
        reader.readAsDataURL(blob)
      })
      .catch(makeVcard)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          FIXED HEADER — transparent → white on scroll
      ═══════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white border-b border-[#E0E0E0] shadow-sm" : "bg-transparent"
        }`}
      >
        {/* Main row */}
        <div className="container mx-auto px-4 h-[68px] flex items-center lg:grid lg:grid-cols-3">

          {/* ── LEFT: hamburger + logo ── */}
          <div className="flex items-center gap-3 flex-1 lg:flex-none">

            {/* Mobile sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={`lg:hidden p-2 border rounded transition-colors flex-shrink-0 ${
                    scrolled
                      ? "border-[#E0E0E0] hover:bg-[#F5F5F5]"
                      : "border-white/30 hover:bg-white/10"
                  }`}
                >
                  <Menu
                    className={`w-5 h-5 transition-colors duration-300 ${
                      scrolled ? "text-[#333]" : "text-white"
                    }`}
                  />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-white border-r border-gray-100 w-full sm:w-72 flex flex-col p-0 shadow-2xl h-full"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between p-4 pr-16 border-b border-[#E0E0E0] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl leading-none">🌶️</span>
                    <span className="leading-tight">
                      <span style={{ fontFamily: "Impact, Arial Narrow, sans-serif", fontStyle: "italic", fontWeight: 900, color: "#CC0000", fontSize: "0.9rem" }}>
                        HOT-SAUCE
                      </span>
                      <span style={{ fontFamily: "Impact, Arial Narrow, sans-serif", color: "#1A1A1A", fontSize: "0.8rem" }}>
                        <br />SHOP
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="[&_span]:hidden flex items-center">
                      <LoginAuth
                        onLoginSuccess={handleLoginSuccess}
                        onLogout={handleLogout}
                        onShowProfile={handleShowProfile}
                        isLightSection={true}
                        variant="button"
                      />
                    </div>
                    <button
                      onClick={() => { onCartOpen?.(); setIsMenuOpen(false) }}
                      className="relative p-2 rounded-xl hover:bg-[#F5F5F5] text-[#555]"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-[#CC0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                          {cartCount > 9 ? "9+" : cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                  <button
                    onClick={() => { router.push("/"); setIsMenuOpen(false) }}
                    className="w-full text-left px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] text-[#333] font-medium"
                  >
                    Home
                  </button>
                  {navItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { router.push(item.href); setIsMenuOpen(false) }}
                      className="w-full text-left px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] text-[#333] font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-2 mt-1 border-t border-[#E0E0E0]">
                    <div className="flex flex-wrap">
                      <button
                        onClick={() => { router.push("/blog"); setIsMenuOpen(false) }}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] text-[#CC0000] font-semibold"
                      >
                        <Newspaper className="w-4 h-4 shrink-0" /> Blog
                      </button>
                      <button
                        onClick={() => { router.push("/gallery"); setIsMenuOpen(false) }}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] text-[#CC0000] font-semibold"
                      >
                        <Images className="w-4 h-4 shrink-0" /> Gallery
                      </button>
                      <button
                        onClick={downloadVcard}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] text-[#CC0000] font-semibold"
                      >
                        <Download className="w-4 h-4 shrink-0" /> VCard
                      </button>
                    </div>
                    <p className="px-3 pt-3 pb-1 text-sm text-[#AAA] tracking-wide">
                      Scharfe Saucen · Schweiz 🇨🇭
                    </p>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button onClick={() => router.push("/")} className="flex items-center gap-2.5 flex-shrink-0">
              <span className="hidden sm:inline text-3xl leading-none">🌶️</span>
              <div className="hidden sm:block leading-tight">
                <div>
                  <span
                    className={`transition-colors duration-300 ${scrolled ? "text-[#CC0000]" : "text-white"}`}
                    style={{ fontFamily: "Impact, Arial Narrow, sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: "1.2rem" }}
                  >
                    HOT-SAUCE
                  </span>
                  <span
                    className={`transition-colors duration-300 ${scrolled ? "text-[#1A1A1A]" : "text-white"}`}
                    style={{ fontFamily: "Impact, Arial Narrow, sans-serif", fontWeight: 900, fontSize: "1.05rem" }}
                  >
                    {" "}SHOP
                  </span>
                </div>
                <div
                  className={`text-xs tracking-widest uppercase mt-0.5 transition-colors duration-300 ${
                    scrolled ? "text-[#666]" : "text-white/60"
                  }`}
                >
                  Scharfe Saucen · Schweiz
                </div>
              </div>
            </button>
          </div>

          {/* ── CENTER: desktop nav (fades in when scrolled) ── */}
          <nav
            className={`hidden lg:flex items-center justify-center gap-0 transition-all duration-300 ${
              scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {navItems.slice(0, 6).map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className="px-3 py-1.5 text-sm font-medium text-[#333] hover:text-[#CC0000] whitespace-nowrap transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* ── RIGHT: login + cart ── */}
          <div className="flex items-center gap-2 lg:justify-end">
            <div className="[&_span]:hidden flex items-center justify-center w-10 h-10 bg-[#CC0000] hover:bg-[#AA0000] rounded-xl transition-colors [&_button]:text-white [&_svg]:text-white [&_button]:hover:bg-transparent [&_button]:w-full [&_button]:h-full [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:p-0">
              <LoginAuth
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onShowProfile={handleShowProfile}
                isLightSection={false}
                variant="button"
              />
            </div>
            <button
              onClick={() => onCartOpen?.()}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#CC0000] hover:bg-[#AA0000] transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#CC0000] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-[#CC0000]/20">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO — full viewport, image starts at very top
      ═══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ height: "100svh", minHeight: "620px" }}
      >
        {/* Background image */}
        <img
          src="/images/hot-sauce/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scale(1.04)", transformOrigin: "center center" }}
          onError={(e) => {
            const el = e.currentTarget
            el.style.display = "none"
            if (el.parentElement)
              el.parentElement.style.background =
                "linear-gradient(135deg, #1a0000 0%, #2a0000 50%, #4a0000 100%)"
          }}
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
        />
        {/* Top vignette so transparent nav is still readable */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 18%)" }}
        />

        {/* ── Hero content ── */}
        <div
          className="relative z-10 h-full flex items-center container mx-auto px-6"
        >
          <div className="max-w-2xl">
            {/* Sale badge */}
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="bg-[#CC0000] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                🔥 Frühjahrs-Sale
              </span>
              <span className="text-white/55 text-xs font-medium tracking-wide">Bis zu 30% Rabatt</span>
            </div>

            {/* Heading */}
            <h1
              className="text-white font-black leading-[1.05] mb-5"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                letterSpacing: "-0.02em",
              }}
            >
              Scharfe Saucen<br />
              <span className="text-[#CC0000]">aus aller Welt</span>
            </h1>

            <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-lg">
              Hot Sauces, Chilisaucen & Gewürze — entdecke<br />
              einzigartige Aromen jetzt zum Sale-Preis.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/shop")}
                className="bg-white text-[#1A1A1A] font-bold px-8 py-3.5 text-sm hover:bg-[#F0F0F0] transition-all rounded-full inline-flex items-center gap-2 shadow-xl"
              >
                Zum Angebot <span className="text-base">→</span>
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-3.5 text-sm transition-all rounded-full hover:bg-white/10"
              >
                Alle Kategorien
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/12">
              {[
                { val: "200+", label: "Saucen" },
                { val: "1–3 Tage", label: "Lieferung" },
                { val: "100%", label: "Schweizer Shop" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-white font-black text-xl leading-none">{val}</div>
                  <div className="text-white/45 text-xs mt-1 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Trust bar at bottom of hero ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/35 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
            {["100% Schweizer Shop", "Schnelle Lieferung", "14 Tage Rückgaberecht"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-white/80">
                <span className="text-[#CC0000] font-bold">✓</span>
                {item}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <span className="text-[#CC0000] font-bold">✓</span>
              <span>
                <span className="font-bold">{count}+</span> Saucen im Sortiment
              </span>
            </span>
          </div>
        </div>

        {/* Accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#CC0000]/70 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════
          BRANDS MARQUEE
      ═══════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E0E0E0] py-8">
        <div className="container mx-auto px-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-l from-[#E0E0E0] to-transparent" />
            <h2 className="text-xs font-black text-[#888] uppercase tracking-[0.18em] whitespace-nowrap">
              Unsere beliebtesten Marken
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#E0E0E0] to-transparent" />
          </div>
        </div>
        <div className="overflow-hidden w-full">
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track { animation: marquee 80s linear infinite; }
          `}</style>
          <div className="flex marquee-track w-max">
            {[...Array(2)].flatMap((_, copy) =>
              [
                { name: "TABASCO",        domain: "tabasco.com",           style: "text-[#CC0000] font-black text-base tracking-widest" },
                { name: "EL YUCATECO",    domain: "elyucateco.com",        style: "text-[#1A7A1A] font-black text-base tracking-wide" },
                { name: "CHOLULA",        domain: "cholula.com",           style: "text-[#CC0000] font-black text-base tracking-wide" },
                { name: "FRANK'S",        domain: "franksredhot.com",      style: "text-[#CC0000] font-black text-sm tracking-widest" },
                { name: "VALENTINA",      domain: "valentina.com.mx",      style: "text-[#8B0000] font-black text-base tracking-wide" },
                { name: "MAD DOG",        domain: "asifoods.com",          style: "text-[#1A1A1A] font-black text-base" },
                { name: "MARIE SHARP'S",  domain: "mariesharp.com",        style: "text-[#CC6600] font-black text-sm" },
                { name: "MELINDA'S",      domain: "melindas.com",          style: "text-[#CC0000] font-black text-sm tracking-wide" },
                { name: "BLAIR'S",        domain: "extremefood.com",       style: "text-[#8B0000] font-bold text-sm tracking-wide" },
                { name: "DAVE'S",         domain: "davesgourtmet.com",     style: "text-[#CC0000] font-black text-base" },
                { name: "YELLOWBIRD",     domain: "yellowbirdsauce.com",   style: "text-[#CC8800] font-black text-base tracking-wide" },
                { name: "TORCHBEARER",    domain: "torchbearersauces.com", style: "text-[#333] font-black text-sm tracking-wide" },
                { name: "SECRET AARDVARK",domain: "secretaardvark.com",    style: "text-[#555] font-black text-sm" },
              ].map((brand) => (
                <div
                  key={`${copy}-${brand.name}`}
                  className="flex-shrink-0 mx-[5px] px-4 py-2 rounded-full border border-[#EBEBEB] bg-white flex items-center gap-2.5 select-none"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`}
                    alt={brand.name}
                    className="h-5 w-auto object-contain flex-shrink-0"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                  />
                  <span className={brand.style}>{brand.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TOP KATEGORIEN
      ═══════════════════════════════════════════ */}
      <div id="spice-discovery" className="bg-white border-b border-[#E8E8E8] py-14">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-0.5 bg-[#CC0000] rounded-full" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#CC0000]">Sortiment</p>
              </div>
              <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Unsere Top Kategorien</h2>
              <p className="text-sm text-[#999] mt-1.5">Entdecke die besten Saucen nach Kategorie.</p>
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="hidden sm:inline-flex items-center gap-2 bg-[#F5F5F5] hover:bg-[#CC0000] hover:text-white text-[#1A1A1A] text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200"
            >
              Alle anzeigen <span>→</span>
            </button>
          </div>

          {/* Skeleton */}
          {categories.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-[#F0F1F3] animate-pulse aspect-[4/3]" />
              ))}
            </div>
          )}

          {/* Grid */}
          {categories.length > 0 && (() => {
            const cats = categories.slice(0, 6)
            return (
              <div className="flex flex-col gap-4">
                {/* Top row: 2 featured wide cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cats.slice(0, 2).map((cat, i) => {
                    const catProds = products.filter(p => p.category === cat.slug || p.category === cat.name)
                    const srcs = getCategoryImage(catProds)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat.name)}`)}
                        className="relative overflow-hidden rounded-3xl bg-[#111] group text-left h-[220px]"
                      >
                        <CatImageCard
                          srcs={srcs}
                          alt={cat.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                          <div>
                            {i === 0 && (
                              <span className="inline-block bg-[#CC0000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                Top Kategorie
                              </span>
                            )}
                            <div className="text-white font-black text-xl leading-tight drop-shadow-lg tracking-tight">
                              {cat.name}
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#CC0000] group-hover:border-[#CC0000] transition-all duration-300">
                            <span className="text-white text-sm group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Bottom row: 4 smaller cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cats.slice(2, 6).map((cat) => {
                    const catProds = products.filter(p => p.category === cat.slug || p.category === cat.name)
                    const srcs = getCategoryImage(catProds)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat.name)}`)}
                        className="relative overflow-hidden rounded-2xl bg-[#111] group text-left h-[150px]"
                      >
                        <CatImageCard
                          srcs={srcs}
                          alt={cat.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#CC0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
                        <div className="absolute inset-x-0 bottom-0 p-3.5">
                          <div className="text-white font-black text-sm leading-tight tracking-wide mb-0.5">
                            {cat.name}
                          </div>
                          <div className="text-white/50 text-[11px] group-hover:text-[#FF6666] transition-colors">
                            Entdecken →
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Mobile CTA */}
          <div className="mt-6 sm:hidden">
            <button
              onClick={() => router.push("/shop")}
              className="w-full py-3.5 rounded-2xl bg-[#CC0000] text-white text-sm font-bold transition-all hover:bg-[#AA0000]"
            >
              Alle Kategorien anzeigen →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-6 bottom-6 z-50 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-3 shadow-xl border border-gray-200 transition-all hover:scale-110 active:scale-95"
          aria-label="Nach oben scrollen"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
