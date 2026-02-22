"use client"

import { useRouter } from "next/navigation"
import { Newspaper, ArrowRight, BookOpen } from "lucide-react"

export function BlogBanner() {
  const router = useRouter()

  return (
    <section className="py-14 bg-[#F4F4F5]">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.push("/blog")}
          className="w-full group relative overflow-hidden rounded-3xl text-left transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img
              src="/images/shop/488657394_1257007002863524_6579276074813205025_n.jpg"
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F0A]/90 via-[#1A3A1A]/75 to-[#2C5F2E]/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-14 py-12 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center gap-8">

            {/* Left: icon + text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <Newspaper className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[11px] font-bold uppercase tracking-widest">Blog & Aktuelles</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-4">
                Expertentipps & Neuigkeiten<br className="hidden sm:block" />
                <span className="text-[#7DC87D]"> aus dem Shop</span>
              </h2>

              <p className="text-white/75 text-base leading-relaxed max-w-xl">
                Entdecke Produkttests, Angelguides, Messerpflege-Tipps und alles rund um Jagd &amp; Outdoor — direkt aus unserem Fachgeschäft in Sevelen.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 bg-white text-[#1A3A1A] font-black text-sm px-7 py-4 rounded-2xl group-hover:bg-[#7DC87D] transition-colors duration-300 shadow-lg">
                <BookOpen className="w-5 h-5" />
                Zum Blog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </button>
      </div>
    </section>
  )
}
