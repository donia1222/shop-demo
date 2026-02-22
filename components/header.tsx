"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, ChevronDown, Menu, ArrowUp, Newspaper } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LoginAuth } from "./login-auth"
import { UserProfile } from "./user-profile"

interface HeaderProps {
  onAdminOpen: () => void
}

export function Header({ onAdminOpen }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [isLightSection] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const categories = [
    { label: "% Sale %", href: "/shop", highlight: true },
    { label: "Messer", href: "/shop?cat=Messer" },
    { label: "Armbrust", href: "/shop?cat=Armbrust" },
    { label: "Pfeilbogen", href: "/shop?cat=Pfeilbogen" },
    { label: "Beil", href: "/shop?cat=Beil" },
    { label: "Security", href: "/shop?cat=Security" },
    { label: "Lampen", href: "/shop?cat=Lampen" },
    { label: "Schleuder & Blasrohr", href: "/shop?cat=Schleuder%20%26%20Blasrohr" },
    { label: "Rauch & Grill", href: "/shop?cat=Rauch%20%26%20Grill" },
  ]

  const handleLoginSuccess = (_user: any) => {}
  const handleLogout = () => {}
  const handleShowProfile = () => {
    setShowUserProfile(true)
    setIsMenuOpen(false)
  }
  const handleProfileClose = () => setShowUserProfile(false)

  return (
    <>
    


      {/* ── TIER 2: Logo + Search + Icons ── */}
      <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-3">

          {/* LEFT: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 border border-[#E0E0E0] rounded hover:bg-[#F5F5F5] flex-shrink-0">
                  <Menu className="w-5 h-5 text-[#333]" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-white p-0">
                <div className="flex items-center p-4 border-b border-[#E0E0E0]">
                  <div className="flex items-center gap-2">
                    <img src="/Security_n.png" alt="Logo" className="h-8 w-auto object-contain" />
                    <span className="font-black text-[#1A1A1A] text-sm">US - Fishing &amp; Huntingshop</span>
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  {categories.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => { router.push(cat.href); setIsMenuOpen(false) }}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded hover:bg-[#F5F5F5] ${cat.highlight ? "text-[#CC0000] font-bold" : "text-[#333333] font-medium"}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </nav>
                {/* Login + Cart in mobile menu */}
                <div className="p-4 border-t border-[#E0E0E0] space-y-2">
                  <LoginAuth
                    onLoginSuccess={handleLoginSuccess}
                    onLogout={handleLogout}
                    onShowProfile={handleShowProfile}
                    isLightSection={true}
                    variant="button"
                    className="w-full !flex-row justify-start gap-3 px-3 py-2.5 rounded hover:bg-[#F5F5F5] min-w-0"
                  />
                  <button
                    onClick={() => { router.push("/shop"); setIsMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#333333] rounded hover:bg-[#F5F5F5]"
                  >
                    <ShoppingCart className="w-5 h-5 text-[#555]" />
                    Warenkorb
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <img
                src="/Security_n.png"
                alt="US - Fishing & Huntingshop"
                className="h-16 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <div className="font-black text-[#1A1A1A] text-xl leading-none tracking-tight">US - Fishing &amp; Huntingshop</div>
                <div className="text-xs text-[#666] tracking-widest uppercase mt-1">Jagd · Angeln · Outdoor</div>
              </div>
            </button>
          </div>

          {/* RIGHT: Login + Cart */}
          <div className="flex items-center gap-1 justify-end">
            <div className="[&_span]:hidden flex items-center justify-center">
              <LoginAuth
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onShowProfile={handleShowProfile}
                isLightSection={isLightSection}
                variant="button"
              />
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="flex items-center justify-center w-11 h-11 hover:bg-[#F5F5F5] rounded-xl transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-[#555]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── TIER 3: Category navigation bar ── */}
      <div className="bg-white border-b border-[#E0E0E0] hidden lg:block sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-0">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => router.push(cat.href)}
                className={`
                  flex items-center gap-1 px-4 py-3.5 text-[15px] font-medium whitespace-nowrap border-b-2 border-transparent
                  hover:border-[#2C5F2E] hover:text-[#2C5F2E] transition-colors
                  ${cat.highlight ? "text-[#CC0000] font-bold hover:border-[#CC0000] hover:text-[#CC0000]" : "text-[#333333]"}
                `}
              >
                {cat.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-40" />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {showUserProfile && (
        <UserProfile
          onClose={handleProfileClose}
          onAccountDeleted={() => setShowUserProfile(false)}
        />
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-[#2C5F2E] hover:bg-[#1A4520] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Nach oben scrollen"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
