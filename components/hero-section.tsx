"use client"

import { Crown, Award, Truck, ArrowRight, Flame, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToProducts = () => {
    const element = document.getElementById("products")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
  

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-black text-white overflow-hidden"
    >
      {/* Fondo dinámico con paralax */}
      <div 
        className="absolute inset-0 opacity-30 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: "url('/condiment-flavor-based-chili-pepper.jpg')",
          backgroundSize: "120%",
          backgroundPosition: "center",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />

      {/* Efectos de luz animados */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Patrón de puntos animado */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ef4444 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #f97316 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
      </div>

      {/* Overlay con gradiente mejorado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

      {/* Elementos geométricos flotantes */}
      <div className="absolute top-20 right-20 w-2 h-40 bg-gradient-to-b from-red-500 to-transparent opacity-80 transform rotate-12 animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-40 h-2 bg-gradient-to-r from-orange-500 to-transparent opacity-80 transform -rotate-12 animate-pulse delay-500"></div>
      <div className="absolute top-1/2 right-10 w-1 h-20 bg-gradient-to-b from-yellow-500 to-transparent opacity-60 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col justify-center min-h-screen">
        <div className="text-center max-w-7xl mx-auto">
          
          {/* Badge Premium con animación */}
          <div className={`flex justify-center mb-12 mt-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-red-600/90 to-orange-500/90 backdrop-blur-sm text-white font-bold text-sm px-8 py-3 rounded-full border border-red-400/30 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <Crown className="w-4 h-4 mr-2 animate-pulse" />
                  <span>PREMIUM COLLECTION</span>
                  <Flame className="w-4 h-4 ml-2 text-yellow-300 animate-bounce" />
                </div>
              </div>
            </div>
          </div>

          {/* Título principal con efectos */}
          <div className={`mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter leading-none relative">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                HOT
              </span>
              <span className="text-white mx-4">&</span>
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse delay-500">
                BBQ
              </span>
            </h1>
            
            {/* Línea decorativa animada */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent to-red-500 animate-pulse"></div>
              <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
              <div className="h-1 w-20 bg-gradient-to-l from-transparent to-orange-500 animate-pulse delay-300"></div>
            </div>
          </div>

          {/* Descripción con efectos */}
          <div className={`max-w-4xl mx-auto mb-20 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-gray-200 font-light leading-relaxed">
              Die <span className="text-red-400 font-semibold">exklusivste</span> Premium-Kollektion 
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                BBQ & scharfer Saucen
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* Fade bottom mejorado */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </section>
  )
}