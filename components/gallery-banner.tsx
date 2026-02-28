"use client"

import { useRouter } from "next/navigation"
import { Images, ArrowRight } from "lucide-react"

export function GalleryBanner() {
  const router = useRouter()

  return (
    <section className="py-6 bg-[#F0F1F3]">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.push("/gallery")}
          className="w-full group relative overflow-hidden rounded-3xl text-left transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img
              src="/images/hot-sauce/gallery.jpg"
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0000]/95 via-[#1A0000]/80 to-[#1A0000]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-14 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-8">

            {/* Left: icon + text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <Images className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[11px] font-bold uppercase tracking-widest">Foto-Galerie</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-4">
                Eindrücke aus unserem Shop<br className="hidden sm:block" />
                <span className="text-[#CC0000]"> & scharfe Momente</span>
              </h2>

              <p className="text-white/75 text-base leading-relaxed max-w-xl">
                Entdecke Bilder aus unserem Fachgeschäft, von Verkostungen und unvergesslichen Sauce-Erlebnissen.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 bg-white text-[#1A1A1A] font-black text-sm px-7 py-4 rounded-2xl group-hover:bg-[#CC0000] group-hover:text-white transition-colors duration-300 shadow-lg">
                <Images className="w-5 h-5" />
                Zur Galerie
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </button>
      </div>
    </section>
  )
}
