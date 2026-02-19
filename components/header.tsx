"use client"

import { useState, useEffect } from "react"
import { Flame, Zap, Home, ChefHat, Heart, Menu, X, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { AdminAuth } from "./admin-auth"
import { LoginAuth } from "./login-auth"
import { UserProfile } from "./user-profile"
interface HeaderProps {
  onAdminOpen: () => void
}

// Componente personalizado para icono de chili
const ChiliIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M12 2c0 0 2 1 2 3" stroke="currentColor" fill="none" />
      <path
        d="M10 5c-2 0-4 2-4 5s1 6 2 8c1 2 3 3 4 3s3-1 4-3c1-2 2-5 2-8s-2-5-4-5c-1 0-2 0-4 0z"
        fill="currentColor"
        opacity="0.8"
      />
      <path d="M11 8c0 2 0 4 1 6" stroke="white" strokeWidth="1" opacity="0.3" />
      <path d="M13 9c0 1.5 0 3 1 4" stroke="white" strokeWidth="1" opacity="0.2" />
      <circle cx="16" cy="7" r="0.5" fill="orange" opacity="0.8" />
      <circle cx="18" cy="9" r="0.3" fill="red" opacity="0.6" />
      <circle cx="17" cy="11" r="0.4" fill="orange" opacity="0.7" />
    </svg>
  </div>
)

// Componente personalizado para icono de BBQ
const BBQIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <rect x="3" y="11" width="18" height="8" rx="2" />
      <line x1="6" y1="11" x2="6" y2="19" />
      <line x1="10" y1="11" x2="10" y2="19" />
      <line x1="14" y1="11" x2="14" y2="19" />
      <line x1="18" y1="11" x2="18" y2="19" />
      <ellipse cx="12" cy="8" rx="4" ry="2" fill="currentColor" opacity="0.7" />
      <path d="M8 5c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" opacity="0.5" />
      <path d="M14 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" opacity="0.5" />
    </svg>
  </div>
)

export function Header({ onAdminOpen }: HeaderProps) {
  // Estados del header y navegación
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")
  const [showUserProfile, setShowUserProfile] = useState(false)
  // Secciones con fondo claro  
  const lightSections = ["premium-showcase", "offers"]
  // Secciones con fondo oscuro
  const darkSections = ["spice-discovery"]
  const isLightSection = lightSections.includes(currentSection)
  const isDarkSection = darkSections.includes(currentSection)

  // Detecta la sección actual basada en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Lógica para ocultar/mostrar header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)

      // Detectar sección actual
      const sections = ["hero", "premium-showcase", "offers", "recipes", "pairing"]
      const sectionElements = sections.map((id) => ({
        id,
        element: document.getElementById(id),
        offset: document.getElementById(id)?.offsetTop || 0,
      }))

      const currentSectionId =
        sectionElements.find((section, index) => {
          const nextSection = sectionElements[index + 1]
          const sectionTop = section.offset - 100 // Offset para el header
          const sectionBottom = nextSection ? nextSection.offset - 100 : Number.POSITIVE_INFINITY
          return currentScrollY >= sectionTop && currentScrollY < sectionBottom
        })?.id || "hero"

      setCurrentSection(currentSectionId)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const navItems = [
    {
      id: "hero",
      label: "Startseite",
      icon: Home,
      description: "Zur Hauptseite",
    },
    {
      id: "spice-discovery",
      label: "Scharfer Test",
      icon: Thermometer,
      description: "Encuentra tu nivel perfecto",
    },
    {
      id: "offers",
      label: "Scharfe Saucen",
      icon: ChiliIcon,
      description: "Feurige Saucen",
    },
    {
      id: "recipes",
      label: "Rezepte",
      icon: ChefHat,
      description: "Grillrezepte",
    },
  ]

  // Estilos dinámicos basados en la sección actual
  const headerStyles = isLightSection
    ? "bg-black/80 backdrop-blur-2xl border-b border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    : isDarkSection
    ? "bg-black/80 backdrop-blur-2xl border-b border-red-500/20 shadow-[0_8px_32px_rgba(239,68,68,0.2)]"
    : "bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"

  const menuStyles = isLightSection
    ? "bg-black/90 backdrop-blur-2xl border-r border-gray-800/50 shadow-2xl"
    : isDarkSection
    ? "bg-black/90 backdrop-blur-2xl border-r border-red-500/20 shadow-2xl"
    : "bg-black/40 backdrop-blur-2xl border-r border-white/10 shadow-2xl"

  const textColor = (isLightSection || isDarkSection) ? "text-white" : "text-gray-300"
  const textColorHover = (isLightSection || isDarkSection) ? "hover:text-gray-200" : "hover:text-white"

  const handleLoginSuccess = (user: any) => {
    console.log("Usuario logueado en header:", user)
    // Aquí puedes manejar el estado global del usuario si es necesario
  }

  const handleLogout = () => {
    console.log("Usuario deslogueado en header")
    // Aquí puedes limpiar el estado global del usuario si es necesario
  }

  const handleShowProfile = () => {
    setShowUserProfile(true)
    setIsMenuOpen(false) // Cerrar menú móvil al abrir perfil
  }

  const handleProfileClose = () => {
    setShowUserProfile(false)
  }
  return (
    <>
      <header
      className={`
        fixed top-0 left-0 w-full z-50
        ${headerStyles}
        transform transition-all duration-500 ease-out
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
        ${
          isLightSection
            ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500/10 before:via-red-500/10 before:to-orange-500/10 before:pointer-events-none"
            : "before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500/5 before:via-red-500/5 before:to-orange-500/5 before:pointer-events-none"
        }
      `}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Admin Button + Login Button Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-110"></div>
              <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-4 rounded-2xl shadow-2xl border border-white/20">
                <Flame className="w-7 h-7 text-white drop-shadow-lg" />
                <Zap className="w-3 h-3 text-yellow-200 absolute -top-1 -right-1 animate-pulse drop-shadow-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent tracking-tight leading-none">
                Salsas.ch
              </h1>
              <p
                className={`text-xs font-medium tracking-wider uppercase ${isLightSection ? "text-gray-300" : "text-gray-400"}`}
              >
                Authentische Grillkultur
              </p>
            </div>


          </div>

          {/* Mobile Layout - Todos los botones a la izquierda */}
          <div className="lg:hidden flex items-center justify-between w-full">
            {/* Logo + Admin Button + Login Button + Menu Button (todos a la izquierda) */}
            <div className="flex items-center space-x-3">
              {/* Logo Mobile */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-xl border border-white/20">
                  <Flame className="w-6 h-6 text-white" />
                  <Zap className="w-2 h-2 text-yellow-200 absolute -top-0.5 -right-0.5 animate-pulse" />
                </div>
              </div>


     

              {/* Menu Button - Al final */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`relative p-2.5 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                      isLightSection
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-orange-400/50"
                        : "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-orange-400/30"
                    }`}
                  >
                    <Menu className="w-4 h-4" />
                    <span className="sr-only">Menü öffnen</span>
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className={`w-80 ${menuStyles}`}>
                  {/* Todo el contenido del menú permanece igual */}
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      isLightSection
                        ? "bg-gradient-to-b from-orange-500/10 via-transparent to-red-500/10"
                        : "bg-gradient-to-b from-orange-500/5 via-transparent to-red-500/5"
                    }`}
                  ></div>

                  <SheetHeader
                    className={`relative pb-6 mb-8 ${
                      isLightSection ? "border-b border-gray-700/50" : "border-b border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-xl">
                            <Flame className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <SheetTitle className="text-xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                            HOT & BBQ
                          </SheetTitle>
                          <p className={`text-xs font-medium ${isLightSection ? "text-gray-300" : "text-gray-400"}`}>
                            Authentische Grillkultur
                          </p>
                        </div>
                      </div>

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-xl transition-all duration-300 ${
                            isLightSection
                              ? "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                              : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </SheetClose>
                    </div>

                    {/* Login en el menú móvil */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <LoginAuth
                        onLoginSuccess={handleLoginSuccess}
                        onLogout={handleLogout}
                        isLightSection={isLightSection}
                        onShowProfile={handleShowProfile}
                        variant="inline"
                        buttonText="Anmelden"
                        className="w-full"
                      />
                    </div>
                  </SheetHeader>

                  <nav className="space-y-2 relative">
                    {navItems.map((item, index) => {
                      const IconComponent = item.icon
                      const isActive = currentSection === item.id

                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full group relative flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                            isActive
                              ? "text-white bg-gradient-to-r from-orange-500/20 to-red-500/20"
                              : `${textColor} ${textColorHover}`
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl ${
                              isLightSection ? "bg-white/10" : "bg-white/5"
                            }`}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>

                          <div
                            className={`relative z-10 p-2 rounded-xl transition-all duration-300 flex items-center justify-center w-10 h-10 ${
                              isActive
                                ? "bg-orange-500/30"
                                : isLightSection
                                  ? "bg-white/10 group-hover:bg-orange-500/20"
                                  : "bg-white/5 group-hover:bg-orange-500/20"
                            }`}
                          >
                            <div className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-all duration-300">
                              {typeof IconComponent === "function" && IconComponent.name === "ChiliIcon" ? (
                                <ChiliIcon className="w-5 h-5" />
                              ) : typeof IconComponent === "function" && IconComponent.name === "BBQIcon" ? (
                                <BBQIcon className="w-5 h-5" />
                              ) : (
                                <IconComponent className="w-5 h-5" />
                              )}
                            </div>
                          </div>

                          <div className="relative z-10 flex-1">
                            <span className="font-semibold tracking-wide block">{item.label}</span>
                            <span className={`text-xs block ${isLightSection ? "text-gray-300" : "text-gray-400"}`}>
                              {item.description}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </nav>

                  {/* Footer Info */}
                  <div className="absolute bottom-8 left-6 right-6">
                    <div
                      className={`relative backdrop-blur-sm rounded-2xl p-5 border overflow-hidden ${
                        isLightSection ? "bg-white/10 border-gray-700/50" : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
                      <div className="relative z-10 text-center">
                        <div className="flex justify-center space-x-2 mb-3">
                          <div className="w-6 h-6 text-orange-400">
                            <BBQIcon />
                          </div>
                          <div className="w-6 h-6 text-red-400">
                            <ChiliIcon />
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${isLightSection ? "text-gray-200" : "text-gray-300"}`}>
                          Die besten scharfen Saucen
                        </p>
                        <p className={`text-xs mt-1 ${isLightSection ? "text-gray-300" : "text-gray-400"}`}>
                          und Premium BBQ-Produkte
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div></div>
          </div>

          {/* Navigation Desktop - Ahora centrado */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = currentSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "text-white bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30"
                      : `${textColor} ${textColorHover}`
                  }`}
                  title={item.description}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl ${
                      isLightSection ? "bg-white/10" : "bg-white/5"
                    }`}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>

                  <div className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-all duration-300 relative z-10">
                    {typeof IconComponent === "function" && IconComponent.name === "ChiliIcon" ? (
                      <ChiliIcon className="w-4 h-4" />
                    ) : typeof IconComponent === "function" && IconComponent.name === "BBQIcon" ? (
                      <BBQIcon className="w-4 h-4" />
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-semibold text-sm relative z-10 tracking-wide">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Login button - Desktop derecha */}
          <div className="hidden lg:flex items-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl">
              <LoginAuth
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onShowProfile={handleShowProfile}
                isLightSection={isLightSection}
                variant="button"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent">
        <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>

      </div>
      </header>

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile
          onClose={handleProfileClose}
          onAccountDeleted={() => {
            setShowUserProfile(false)
          }}
        />
      )}
    </>
  )
}
