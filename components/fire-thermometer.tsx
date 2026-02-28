"use client"

import { useState } from "react"

interface Product {
  id?: number
  name: string
  description: string
  price: number
  image?: string
  image_url?: string
  heatLevel: number
  rating: number
  badge?: string
  origin?: string
  category?: string
  stock?: number
}

interface FireThermometerProps {
  onHeatLevelChange?: (level: number) => void
  onProductRecommend?: (products: Product[]) => void
  products?: Product[]
}

export default function FireThermometer({
  onHeatLevelChange = () => {},
  onProductRecommend = () => {},
  products = [],
}: FireThermometerProps) {
  const [selectedHeat, setSelectedHeat] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const heatLevels = [
    {
      level: 1,
      name: "Mild",
      emoji: "🌿",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      labelColor: "text-emerald-700",
      temp: "bis 1.000 SHU",
      description: "Sanfte Aromen, perfekt für Einsteiger",
    },
    {
      level: 2,
      name: "Mittel",
      emoji: "🌶️",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      labelColor: "text-yellow-700",
      temp: "1.000 – 10.000 SHU",
      description: "Angenehme Schärfe mit vollem Aroma",
    },
    {
      level: 3,
      name: "Scharf",
      emoji: "🔥",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      labelColor: "text-orange-700",
      temp: "10.000 – 100.000 SHU",
      description: "Richtig scharf — für echte Geniesser",
    },
    {
      level: 4,
      name: "Extra",
      emoji: "🌋",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      labelColor: "text-red-700",
      temp: "100.000 – 500.000 SHU",
      description: "Nur für Mutige — intensive Schärfe",
    },
    {
      level: 5,
      name: "Feuer",
      emoji: "☠️",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      labelColor: "text-red-900",
      temp: "500.000+ SHU",
      description: "Das Maximum — nur für wahre Schärfeprofis",
    },
  ]

  const currentLevel = heatLevels.find((h) => h.level === selectedHeat) || heatLevels[0]

  const handleHeatLevelClick = (level: number) => {
    setSelectedHeat(level)
    setIsAnimating(true)
    onHeatLevelChange(level)
    onProductRecommend(products.filter((p) => p.heatLevel === level))
    if ("vibrate" in navigator) navigator.vibrate(level * 30)
    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">

        {/* Current level badge */}
        <div className="flex justify-center mb-6">
          <div
            className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${currentLevel.bgColor} ${currentLevel.borderColor} ${
              isAnimating ? "scale-105" : "scale-100"
            }`}
          >
            <span className="text-2xl">{currentLevel.emoji}</span>
            <div>
              <p className={`font-black text-base leading-tight ${currentLevel.labelColor}`}>
                {currentLevel.name}
              </p>
              <p className="text-xs text-[#888] mt-0.5">{currentLevel.temp}</p>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-1">
          <div className="relative mb-5">
            <input
              type="range"
              min="1"
              max="5"
              value={selectedHeat}
              onChange={(e) => handleHeatLevelClick(parseInt(e.target.value))}
              className="w-full h-3 bg-[#F0F1F3] rounded-full appearance-none cursor-pointer slider"
            />
            {/* Filled track overlay */}
            <div
              className="absolute top-0 left-0 h-3 rounded-full pointer-events-none transition-all duration-300"
              style={{
                width: `${(selectedHeat - 1) * 25}%`,
                background: "linear-gradient(to right, #22c55e, #eab308, #f97316, #dc2626, #7f1d1d)",
              }}
            />
          </div>

          {/* Level buttons */}
          <div className="flex justify-between gap-1">
            {heatLevels.map((level) => (
              <button
                key={level.level}
                onClick={() => handleHeatLevelClick(level.level)}
                className={`flex flex-col items-center flex-1 py-2.5 px-1 rounded-xl transition-all duration-200 hover:scale-105 ${
                  selectedHeat === level.level
                    ? `${level.bgColor} border ${level.borderColor}`
                    : "hover:bg-[#F5F5F5]"
                }`}
              >
                <span className="text-lg mb-0.5">{level.emoji}</span>
                <span
                  className={`text-[10px] font-bold leading-tight text-center ${
                    selectedHeat === level.level ? level.labelColor : "text-[#999]"
                  }`}
                >
                  {level.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-xs text-[#888] mt-4 leading-relaxed">
          {currentLevel.description}
        </p>
      </div>

      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000, #ff4500);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(204, 0, 0, 0.3), 0 0 0 2px rgba(204, 0, 0, 0.12);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 3px 12px rgba(204, 0, 0, 0.45), 0 0 0 3px rgba(204, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #cc0000, #ff4500);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(204, 0, 0, 0.3);
        }
        .slider::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 6px;
          background: #f0f1f3;
        }
        .slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          background: #f0f1f3;
          border: none;
        }
      `}</style>
    </div>
  )
}
