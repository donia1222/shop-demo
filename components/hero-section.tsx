"use client"

import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <div className="bg-white">

      {/* ── Trust bar ── */}
      <div className="border-b border-[#E0E0E0] bg-white">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm text-[#333333]">
            {[
              "100% Schweizer Shop",
              "Schnelle Lieferung",
              "14 Tage Rückgaberecht",
              "500+ Artikel im Sortiment",
    
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="text-[#2C5F2E] font-bold">✓</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div
        id="hero"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "520px" }}
      >
        {/* Background photo — outdoor/hunting/forest */}
        <img
          src="/images/shop/header.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scale(1.04)", transformOrigin: "center center" }}
          onError={(e) => {
            const el = e.currentTarget
            el.style.display = "none"
            if (el.parentElement) {
              el.parentElement.style.background =
                "linear-gradient(135deg, #0d1a0a 0%, #1a2e10 50%, #2d4a1e 100%)"
            }
          }}
        />
        {/* Cinematic overlay — dark left, fade right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />
        {/* Vignette bottom */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 flex items-center" style={{ minHeight: "520px" }}>
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="bg-[#CC0000] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                🔥 Frühjahrs-Sale
              </span>
              <span className="text-white/55 text-xs font-medium tracking-wide">Bis zu 30% Rabatt</span>
            </div>

            <h1
              className="text-white font-black leading-[1.05] mb-5"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                letterSpacing: "-0.02em",
              }}
            >
              Top-Ausrüstung<br />
              <span className="text-[#6DBF6A]">zu Bestpreisen</span>
            </h1>

            <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-lg">
              Jagd, Angeln & Outdoor — alles was du brauchst,<br />
              jetzt zum Frühjahrs-Sale-Preis.
            </p>

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

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/12">
              {[
                { val: "500+", label: "Artikel" },
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

        {/* Right accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#2C5F2E]/70 to-transparent" />
      </div>

      {/* ── Unsere beliebtesten Marken ── */}
      <div className="bg-white border-b border-[#E0E0E0] py-8">
        <div className="container mx-auto px-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-l from-[#E0E0E0] to-transparent" />
            <h2 className="text-xs font-black text-[#888] uppercase tracking-[0.18em] whitespace-nowrap">Unsere beliebtesten Marken</h2>
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
                { name: "AIRSOFT",      domain: "airsoft.ch",               style: "text-[#1A1A1A] font-black text-base tracking-widest" },
                { name: "BLACKFLASH",   domain: "black-flash-archery.com",  style: "text-[#1A1A1A] font-black text-base tracking-widest" },
                { name: "BÖKER",        domain: "boker.de",                 style: "text-[#8B0000] font-black text-base tracking-wide" },
                { name: "FISHERMAN'S",  domain: "fishermans-partner.eu",    style: "text-[#1A5276] font-black text-sm" },
                { name: "HALLER",       domain: "haller-stahlwaren.de",     style: "text-[#2C5F2E] font-black text-base tracking-wide" },
                { name: "JENZI",        domain: "jenzi.com",                style: "text-[#FF6600] font-black text-base" },
                { name: "LINDER",       domain: "linder.de",                style: "text-[#333] font-black text-base tracking-wide" },
                { name: "NATURZONE",    domain: "naturzone.ch",             style: "text-[#2C5F2E] font-bold text-sm tracking-wide" },
                { name: "POHLFORCE",    domain: "pohlforce.de",             style: "text-[#CC0000] font-black text-base" },
                { name: "SMOKI",        domain: "smoki-raeuchertechnik.de", style: "text-[#8B6914] font-black text-sm" },
                { name: "STEAMBOW",     domain: "steambow.at",              style: "text-[#1A1A8C] font-black text-base tracking-wider" },
                { name: "SYTONG",       domain: "sytong.global",            style: "text-[#003087] font-black text-sm tracking-wider" },
                { name: "WILTEC",       domain: "wiltec.de",                style: "text-[#555] font-black text-sm tracking-wide" },
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

      {/* ── Unsere Top Kategorien ── */}
      <div id="spice-discovery" className="bg-[#F0F1F3] border-b border-[#E0E0E0] py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Unsere Top Kategorien</h2>
              <p className="text-sm text-[#888] mt-1">Schnell und einfach zu den passenden Produkten.</p>
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[#2C5F2E] font-semibold hover:gap-3 transition-all duration-200"
            >
              Alle anzeigen <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
            {[
              {
                name: "Messer",
                fallback: "#2a1408",
                // Hunting knife
                img: "https://scontent-zrh1-1.xx.fbcdn.net/v/t1.6435-9/183509301_1470172286666927_279686177092684197_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeEk0J2KE7ctDxKZZtgXtj3qM55ioxNz3f8znmKjE3Pd_96pX18-78vHorg5dlpB11pHPqrGOBtGDtjQIXzKIXe_&_nc_ohc=VYjuZeEdDF4Q7kNvwGGh-jA&_nc_oc=AdnwcJ2jLqBZxmUVb3X_h8e8p0z-Cd68N7Sq7f3mEl4DmyQFk4x1mrmR7MiDZbeOIl5aC2_SyF4Ah-uH8b3yPoQ5&_nc_zt=23&_nc_ht=scontent-zrh1-1.xx&_nc_gid=0XosKR6FgAemWKVSXzhpgA&oh=00_AftEXBQtmPe11T8Fwa135dIltQmXdgNEx9GhEduqNpxVxg&oe=69C03FF4",
              },
              {
                name: "Armbrust",
                fallback: "#1a1a0e",
                // Bow & archery (closest to crossbow available)
                img: "https://scontent-zrh1-1.xx.fbcdn.net/v/t1.6435-9/130860801_1358965424454281_7428481212302775121_n.png?stp=dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeEMJPafDQYYiwAt73oq0KOxwDCtTvHFuzzAMK1O8cW7PJa4yr0L1hrP_4I20aY-J8Hi5vh7iXQwAE5hu4Fp8Gln&_nc_ohc=qrLX1fLSesoQ7kNvwHy6CUG&_nc_oc=Adlsr-gOMdedHRG0poBeHakn0S0ADohLmqM3YEBIbUcoteIWmQEIEiz_XodVUVuSrtv3KfO22aTFtSpPcspBDRbN&_nc_zt=23&_nc_ht=scontent-zrh1-1.xx&_nc_gid=Bx_NH35i0vHtPwlj8EF-EA&oh=00_AftskFuJnGsAhuFNJeQtRRa_0gVpF5CCqt2cjX8P1W9wRA&oe=69C06D8C",
              },
              {
                name: "Pfeilbogen",
                fallback: "#0e1a10",
                // Archery / bow
                img: "https://www.bogensportwelt.ch/media/image/product/174716/lg/drake-black-raven-58-zoll-30-lbs-take-down-recurvebogen.webp",
              },
              {
                name: "Beil",
                fallback: "#1e1408",
                // Axe / wood chopping
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMfg6PgRU66g9QzSzb3H3Gw8VtcSiiMmI-Q&s",
              },
              {
                name: "Security",
                fallback: "#141418",
                // Security / tactical
                img: "data:image/jpeg;base64,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",
              },
              {
                name: "Lampen",
                fallback: "#0e0e1a",
                // Flashlight / lamp
                img: "https://cdn03.plentymarkets.com/hu6qien27o6d/item/images/7416/middle/Acebeam-X75-Suchscheinwerfer.jpg.avif",
              },
              {
                name: "Schleuder & Blasrohr",
                fallback: "#141e10",
                // Outdoor forest atmosphere
                img: "https://bilder.frankonia.de/fsicache/server?type=image&source=products/p2017183_ha_v1.jpg&width=1000&height=1000&effects=pad(CC,ffff)&quality=40",
              },
              {
                name: "Armbrust Zubehör",
                fallback: "#1a1208",
                // Axe / wood (second axe image)
                img: "https://img.fruugo.com/product/4/91/1885000914_max.jpg",
              },
              {
                name: "Rauch & Grill",
                fallback: "#1a0e08",
                // BBQ / grill
                img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop&auto=format",
              },
            ].map((cat) => (
              <div
                key={cat.name}
                onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat.name)}`)}
                className="relative overflow-hidden cursor-pointer group rounded-2xl"
                style={{ height: "200px", backgroundColor: cat.fallback }}
              >
                {/* Photo */}
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/70 transition-all duration-300" />
                {/* Hover ring glow */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/30 transition-all duration-300" />
                {/* Category name bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-white font-bold text-xs leading-tight drop-shadow-lg block text-center tracking-wide">
                    {cat.name}
                  </span>
                </div>
                {/* Arrow on hover */}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white/80 text-xs font-bold">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
