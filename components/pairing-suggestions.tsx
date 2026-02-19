"use client"

import { Badge } from "@/components/ui/badge"
import { ChefHat, Utensils, Award } from "lucide-react"

export function PairingSuggestions() {
  const pairings = [
    {
      sauce: "Big Yella",
      subtitle: "Goldene Perfektion",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/10",
      icon: "🌞",
      foods: [
        { emoji: "🌮", name: "Tacos & Burritos", description: "Mexikanische Klassiker" },
        { emoji: "🍗", name: "Gegrilltes Hähnchen", description: "Perfekt mariniert" },
        { emoji: "🥑", name: "Avocado Toast", description: "Frühstücks-Favorit" },
        { emoji: "🍳", name: "Rühreier", description: "Morgendlicher Kick" },
      ]
    },
    {
      sauce: "Heat Wave",
      subtitle: "Feurige Intensität",
      color: "red",
      gradient: "from-red-500 to-orange-600",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/10",
      icon: "🔥",
      foods: [
        { emoji: "🍕", name: "Pizza Margherita", description: "Italienische Tradition" },
        { emoji: "🥩", name: "Gegrilltes Steak", description: "Premium Fleisch" },
        { emoji: "🍝", name: "Pasta Arrabbiata", description: "Scharfe Pasta" },
        { emoji: "🌭", name: "Gourmet Hot Dogs", description: "Amerikanischer Stil" },
      ]
    },
    {
      sauce: "Green Chili",
      subtitle: "Frische Schärfe",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10",
      icon: "🌿",
      foods: [
        { emoji: "🥗", name: "Gourmet Salate", description: "Frisch & knackig" },
        { emoji: "🐟", name: "Gegrillter Fisch", description: "Meeresfrüchte" },
        { emoji: "🥙", name: "Wraps & Quesadillas", description: "Leichte Küche" },
        { emoji: "🍲", name: "Suppen & Eintöpfe", description: "Warme Gerichte" },
      ]
    }
  ]

  return (
    <section id="pairing" className="py-24 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Modern Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center border border-gray-600">
              <ChefHat className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
            Food Pairing Guide
          </h3>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Professionelle Empfehlungen für die perfekte Harmonie zwischen unseren Premium-Saucen und kulinarischen Meisterwerken
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Pairing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {pairings.map((pairing, index) => (
            <div
              key={pairing.sauce}
              className={`group relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border ${pairing.borderColor} hover:border-opacity-60 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${pairing.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Header */}
              <div className="text-center mb-8 relative">
                <div className={`w-24 h-24 ${pairing.bgColor} backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border ${pairing.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl filter drop-shadow-lg">{pairing.icon}</span>
                </div>
                <h4 className={`text-3xl font-bold bg-gradient-to-r ${pairing.gradient} bg-clip-text text-transparent mb-2`}>
                  {pairing.sauce}
                </h4>
                <p className="text-gray-400 font-medium tracking-wide">{pairing.subtitle}</p>
              </div>

              {/* Food Items */}
              <div className="space-y-4">
                {pairing.foods.map((food, foodIndex) => (
                  <div
                    key={foodIndex}
                    className="group/item flex items-center space-x-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:bg-gray-700/40"
                  >
                    <div className="text-2xl flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      {food.emoji}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white text-lg group-hover/item:text-orange-400 transition-colors duration-300">
                        {food.name}
                      </h5>
                      <p className="text-gray-400 text-sm font-medium">{food.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Index */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600">
                  <span className="text-xs font-bold text-gray-300">{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Chef's Section */}
        <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-3xl p-12 shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Award className="w-12 h-12 text-orange-400" />
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <ChefHat className="w-12 h-12 text-orange-400" />
            </div>
            
            <h4 className="text-4xl font-black text-white mb-6">
              Experten-Empfehlung
            </h4>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
              "Beginnen Sie mit wenigen Tropfen und entwickeln Sie Ihr Geschmacksprofil schrittweise. 
              Jede unserer Saucen wurde präzise komponiert, um spezifische Aromen zu verstärken und 
              kulinarische Erlebnisse zu intensivieren."
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 text-lg border-0 hover:shadow-lg transition-shadow duration-300">
                🏆 Premium Qualität seit 1995
              </Badge>
              <Badge className="bg-gray-700 text-orange-400 font-bold px-6 py-3 text-lg border border-orange-400/30 hover:bg-gray-600 transition-colors duration-300">
                ⚡ Handwerklich gefertigt
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}