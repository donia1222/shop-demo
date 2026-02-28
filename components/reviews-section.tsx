"use client"

const reviews = [
  {
    name: "Camille Dürr",
    date: "Vor 1 Jahr",
    text: "Ich habe meine Leidenschaft für scharfe Saucen hier entdeckt. Die Auswahl ist hervorragend. Das Personal ist sehr aufmerksam und kompetent. Ich komme sehr gerne wieder.",
    stars: 5,
  },
  {
    name: "Ikarus von Roll",
    date: "Vor 1 Jahr",
    text: "Ein toller Hot-Sauce Shop mit ausgezeichneter Beratung. Selbst Einsteiger fühlen sich gut betreut und finden die passende Sauce. 👍🏻",
    stars: 5,
  },
  {
    name: "Damian",
    date: "Vor 2 Jahren",
    text: "Ausgezeichnete Auswahl an Chilisaucen aus aller Welt. Hier findet man wirklich alles, von mild bis extrem scharf.",
    stars: 5,
  },
  {
    name: "Paaatrice",
    date: "Vor 1 Jahr",
    text: "Ausgezeichnete Beratung und Service. Die Tabasco-Auswahl ist unglaublich. Würde dort wieder einkaufen. 💪🏻",
    stars: 5,
  },
  {
    name: "Frog Gray",
    date: "Vor 4 Jahren",
    text: "Amazing selection of hot sauces. Very helpful staff and great shop overall!",
    stars: 5,
  },
  {
    name: "C. Mullis",
    date: "Vor 7 Monaten",
    text: "Toller Laden, sehr gut sortiert. Die El Yucateco Saucen hier sind mein Favorit.",
    stars: 5,
  },
  {
    name: "Bierschnecke Liechtenstein",
    date: "Vor 4 Jahren",
    text: "Eine tolle Beratung für alle Hot-Sauce Liebhaber. Die Auswahl an exklusiven Saucen ist einzigartig in der Schweiz. Sehr empfehlenswert!",
    stars: 5,
  },
]

const avatarGradients = [
  "from-[#CC0000] to-[#ef4444]",
  "from-[#1A6B8A] to-[#2a9bbf]",
  "from-[#7C3AED] to-[#a855f7]",
  "from-[#FF4500] to-[#FF6B35]",
  "from-[#D97706] to-[#f59e0b]",
  "from-[#0891B2] to-[#06b6d4]",
  "from-[#8B0000] to-[#CC0000]",
]

const GoogleLogo = ({ size = 5 }: { size?: number }) => (
  <svg className={`w-${size} h-${size} flex-shrink-0`} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-[#FBBC04] fill-[#FBBC04]" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

export function ReviewsSection() {
  return (
    <section className="bg-[#0D0D0D] border-t border-[#1A1A1A] py-14">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
              Verifizierte Kundenbewertungen
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Was unsere Kunden sagen</h2>
            <p className="text-sm text-[#666] mt-1">Echte Erfahrungen — direkt von Google.</p>
          </div>

          {/* Google rating badge */}
          <div className="flex items-center gap-4 bg-[#141414] border border-[#333] rounded-2xl px-6 py-4 shadow-sm self-start sm:self-auto">
            <GoogleLogo size={8} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-3xl text-white leading-none">4.8</span>
                <div className="flex flex-col gap-0.5">
                  <Stars count={5} />
                  <span className="text-xs text-[#666]">41 Bewertungen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="relative">
          {/* Fade right */}
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-[#0D0D0D] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {reviews.map((review, i) => {
              const gradient = avatarGradients[i % avatarGradients.length]
              return (
                <div
                  key={i}
                  className="flex-shrink-0 bg-[#141414] rounded-2xl border border-[#2A2A2A] p-5 hover:shadow-[0_8px_30px_rgba(204,0,0,0.15)] hover:border-[#CC0000]/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  style={{ width: "296px" }}
                >
                  {/* Decorative quote mark */}
                  <div className="text-5xl text-[#2A2A2A] font-serif leading-none select-none mb-1">&ldquo;</div>

                  {/* Review text */}
                  <p className="text-[#999] text-sm leading-relaxed line-clamp-4 flex-1 -mt-2">
                    {review.text}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-[#222] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Gradient avatar */}
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <span className="text-white font-bold text-sm">{review.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm leading-tight truncate">{review.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Stars count={review.stars} />
                          <span className="text-[#555] text-xs">· {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <GoogleLogo size={4} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
