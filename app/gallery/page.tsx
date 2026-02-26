"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, X, ChevronRight, Images } from "lucide-react"

interface GalleryImage {
  id: number
  title: string | null
  image: string
  image_url: string
  created_at: string
}

function Lightbox({ images, startIndex, onClose }: { images: GalleryImage[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length)
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/92" />

      <img
        src={images[idx].image_url}
        alt={images[idx].title ?? ""}
        className="relative z-10 max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none"
        onClick={e => e.stopPropagation()}
      />

      {/* Title */}
      {images[idx].title && (
        <div className="absolute bottom-14 z-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full">
          {images[idx].title}
        </div>
      )}

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length) }}
            className="absolute left-4 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white rotate-180" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length) }}
            className="absolute right-16 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 z-20 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setIdx(i) }}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function GalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(d => { if (d.success) setImages(d.images) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F4F4F5]">

      {/* Header */}
      <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#2C5F2E]/30 text-[#2C5F2E] hover:bg-[#2C5F2E] hover:text-white hover:border-[#2C5F2E] transition-all flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#E5E5E5]" />
          <img src="/Security_n.png" alt="Logo" className="h-12 w-auto object-contain" />
          <span className="sm:hidden" style={{ fontFamily: "'Rubik Dirt', sans-serif", fontSize: '1.1rem', color: '#333333' }}>Impressionen</span>
          <div className="hidden sm:block">
            <div className="leading-tight">
              <span style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontStyle: 'italic', fontWeight: 900, color: '#CC0000', fontSize: '1rem' }}>US-</span>
              <span style={{ fontFamily: "'Rubik Dirt', sans-serif", color: '#1A1A1A', fontSize: '0.9rem' }}> FISHING &amp; HUNTINGSHOP</span>
            </div>
            <div className="text-[11px] text-[#888] uppercase tracking-widest mt-0.5">Bilder · Impressionen · Outdoor</div>
          </div>
        </div>
      </div>

      {/* Page title */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-[#2C5F2E] rounded-full" />
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Galerie</h1>
        </div>
        <p className="text-sm text-[#888] ml-4">Eindrücke aus unserem Shop, Veranstaltungen und Outdoor-Erlebnisse.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl border border-[#EBEBEB] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="text-center py-32">
            <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#BBB] font-semibold text-lg">Noch keine Bilder vorhanden.</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-zoom-in group"
              >
                <div className="overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title ?? ""}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {img.title && (
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#444] leading-snug">{img.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
