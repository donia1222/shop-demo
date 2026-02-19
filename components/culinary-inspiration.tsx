"use client"

import { useState } from "react"
import { ChefHat, Clock, Users, Flame, BookOpen, Package, Utensils, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: string
  sauce: string
  ingredients: string[]
  instructions: string[]
}

const recipes: Recipe[] = [
  {
    id: "recipe1",
    title: "Ultimative Feuer-Burger",
    description:
      "Ein saftiger Burger mit karamellisierten Zwiebeln und unserer Green Chili Sauce für den perfekten Kick",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R-HOME-RECIPE-NPolbggqYID8WgHIkp3II4ltL0oLZR.png",
    prepTime: "15 min",
    cookTime: "20 min",
    servings: 4,
    difficulty: "Mittel",
    sauce: "Big Red's Hot Sauce - Green Chili",
    ingredients: [
      "4 hochwertige Rindfleisch-Patties (je 180g)",
      "4 Brioche-Burgerbrötchen",
      "2 rote Zwiebeln, in Ringe geschnitten",
      "2 EL brauner Zucker",
      "1 EL Balsamico-Essig",
      "200g gereifter Cheddar-Käse",
      "1 Tomate, in Scheiben geschnitten",
      "Frischer grüner Salat",
      "4 EL Big Red's Green Chili Sauce",
      "Salz und Pfeffer nach Geschmack",
      "2 EL Olivenöl",
    ],
    instructions: [
      "Zwiebeln in einer Pfanne mit etwas Öl bei mittlerer Hitze anbraten, bis sie weich werden.",
      "Braunen Zucker und Balsamico-Essig hinzufügen und bei niedriger Hitze karamellisieren lassen (ca. 15 Minuten).",
      "Die Burger-Patties mit Salz und Pfeffer würzen und auf beiden Seiten nach Belieben grillen oder braten.",
      "Kurz vor Ende der Garzeit je eine Scheibe Cheddar auf die Patties legen und schmelzen lassen.",
      "Die Brioche-Brötchen aufschneiden und kurz anrösten.",
      "Die Brötchen mit Green Chili Sauce bestreichen, dann mit Salat, Patty, karamellisierten Zwiebeln und Tomatenscheiben belegen.",
      "Mit dem Brötchendeckel abschließen und sofort servieren.",
    ],
  },
  {
    id: "recipe2",
    title: "Feurige Tacos al Pastor",
    description: "Traditionelle mexikanische Tacos mit marinierten Schweinefleisch und unserer Heat Wave Sauce",
    image: "mexican-tacos-with-beef-tomato-sauce-salsa.jpg",
    prepTime: "30 min + 4h Marinieren",
    cookTime: "25 min",
    servings: 6,
    difficulty: "Fortgeschritten",
    sauce: "Big Red's Hot Sauce - Heat Wave",
    ingredients: [
      "1kg Schweineschulter, in dünne Scheiben geschnitten",
      "3 EL Ananas-Saft",
      "2 EL Limettensaft",
      "3 EL Big Red's Heat Wave Sauce",
      "2 TL gemahlener Kreuzkümmel",
      "2 TL getrockneter Oregano",
      "3 Knoblauchzehen, fein gehackt",
      "1 TL Paprikapulver",
      "1 Ananas, in Scheiben geschnitten",
      "12 kleine Mais-Tortillas",
      "1 Zwiebel, fein gewürfelt",
      "Frischer Koriander",
      "2 Limetten, in Spalten geschnitten",
    ],
    instructions: [
      "Für die Marinade Ananas-Saft, Limettensaft, Heat Wave Sauce, Kreuzkümmel, Oregano, Knoblauch und Paprikapulver vermischen.",
      "Das Schweinefleisch mit der Marinade bedecken und mindestens 4 Stunden (idealerweise über Nacht) im Kühlschrank marinieren.",
      "Grill oder Pfanne stark erhitzen und das marinierte Fleisch 2-3 Minuten pro Seite scharf anbraten.",
      "Ananas-Scheiben kurz grillen, bis sie leichte Grillspuren haben.",
      "Das Fleisch und die Ananas in kleine Stücke schneiden.",
      "Tortillas kurz erwärmen und mit Fleisch, Ananas, Zwiebeln und Koriander füllen.",
      "Mit einem zusätzlichen Spritzer Heat Wave Sauce und Limettenspalten servieren.",
    ],
  },
  {
    id: "recipe3",
    title: "Mediterrane Gemüse-Quesadillas",
    description: "Knusprige Quesadillas mit gegrilltem Gemüse und unserer Smoky Chipotle Sauce",
    image: "mexican-chicken-quesadillas-with-cheese-peppers-wooden-table.jpg",
    prepTime: "20 min",
    cookTime: "15 min",
    servings: 4,
    difficulty: "Einfach",
    sauce: "Big Red's Hot Sauce - Smoky Chipotle",
    ingredients: [
      "4 große Weizen-Tortillas",
      "1 rote Paprika, in Streifen geschnitten",
      "1 gelbe Paprika, in Streifen geschnitten",
      "1 Zucchini, in Scheiben geschnitten",
      "1 rote Zwiebel, in Ringe geschnitten",
      "200g Mozzarella, gerieben",
      "100g Feta-Käse, zerbröckelt",
      "3 EL Big Red's Smoky Chipotle Sauce",
      "2 EL Olivenöl",
      "1 TL getrockneter Oregano",
      "Frischer Basilikum",
      "Salz und Pfeffer nach Geschmack",
    ],
    instructions: [
      "Das Gemüse mit Olivenöl, Salz, Pfeffer und Oregano marinieren.",
      "Gemüse in einer Grillpfanne bei mittlerer Hitze 8-10 Minuten grillen, bis es weich und leicht gebräunt ist.",
      "Eine Tortilla mit Smoky Chipotle Sauce bestreichen.",
      "Die Hälfte der Tortilla mit gegrilltem Gemüse, Mozzarella und Feta belegen.",
      "Tortilla zusammenklappen und in einer Pfanne bei mittlerer Hitze 2-3 Minuten pro Seite goldbraun braten.",
      "In Dreiecke schneiden und mit frischem Basilikum garniert servieren.",
      "Mit zusätzlicher Smoky Chipotle Sauce zum Dippen servieren.",
    ],
  },
  {
    id: "recipe4",
    title: "Würzige Süßkartoffel-Tacos",
    description: "Geröstete Süßkartoffeln mit schwarzen Bohnen und unserer Jalapeño Lime Sauce",
    image: "/placeholder.svg?height=400&width=600",
    prepTime: "15 min",
    cookTime: "30 min",
    servings: 6,
    difficulty: "Einfach",
    sauce: "Big Red's Hot Sauce - Jalapeño Lime",
    ingredients: [
      "2 große Süßkartoffeln, gewürfelt",
      "1 Dose schwarze Bohnen, abgespült",
      "12 kleine Mais-Tortillas",
      "1 Avocado, in Scheiben geschnitten",
      "1/2 Rotkohl, fein gehobelt",
      "1 Limette, in Spalten geschnitten",
      "4 EL Big Red's Jalapeño Lime Sauce",
      "2 EL Olivenöl",
      "1 TL Kreuzkümmel",
      "1 TL Paprikapulver",
      "1/2 TL Cayennepfeffer",
      "Frischer Koriander",
      "Salz nach Geschmack",
    ],
    instructions: [
      "Ofen auf 200°C vorheizen.",
      "Süßkartoffelwürfel mit Olivenöl, Kreuzkümmel, Paprikapulver, Cayennepfeffer und Salz vermischen.",
      "Auf einem Backblech verteilen und 25-30 Minuten rösten, bis sie weich und leicht karamellisiert sind.",
      "Schwarze Bohnen in einem Topf erwärmen und mit etwas Jalapeño Lime Sauce würzen.",
      "Tortillas kurz erwärmen.",
      "Tortillas mit gerösteten Süßkartoffeln, schwarzen Bohnen, Avocado und Rotkohl füllen.",
      "Mit Koriander garnieren und mit Jalapeño Lime Sauce und Limettenspalten servieren.",
    ],
  },
  {
    id: "recipe5",
    title: "Feurige Gemüse-Pasta",
    description: "Cremige Pasta mit geröstetem Gemüse und unserer Garlic Sriracha Sauce",
    image: "/placeholder.svg?height=400&width=600",
    prepTime: "15 min",
    cookTime: "25 min",
    servings: 4,
    difficulty: "Mittel",
    sauce: "Big Red's Hot Sauce - Garlic Sriracha",
    ingredients: [
      "400g Penne oder Fusilli",
      "1 Aubergine, gewürfelt",
      "2 Zucchini, in Scheiben geschnitten",
      "1 rote Paprika, in Streifen",
      "200g Kirschtomaten, halbiert",
      "200ml Sahne",
      "100g Parmesan, gerieben",
      "4 EL Big Red's Garlic Sriracha Sauce",
      "3 Knoblauchzehen, gehackt",
      "3 EL Olivenöl",
      "Frisches Basilikum",
      "Salz und Pfeffer nach Geschmack",
    ],
    instructions: [
      "Pasta nach Packungsanweisung kochen und abgießen, dabei 1 Tasse Nudelwasser aufbewahren.",
      "Gemüse mit Olivenöl, Salz und Pfeffer würzen und bei 200°C 20 Minuten rösten.",
      "In einer großen Pfanne Knoblauch in etwas Öl anbraten.",
      "Sahne und Garlic Sriracha Sauce hinzufügen und köcheln lassen.",
      "Geröstetes Gemüse und gekochte Pasta zur Sauce geben.",
      "Bei Bedarf etwas Nudelwasser hinzufügen für die richtige Konsistenz.",
      "Mit Parmesan und frischem Basilikum garniert servieren.",
    ],
  },
]

export function CulinaryInspiration() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  return (
    <section id="recipes" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-16 h-16 text-orange-400" />
          </div>
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Kulinarische Inspiration
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Entdecken Sie köstliche Rezepte, die mit unseren Premium-Saucen zubereitet werden
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Featured Recipe */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-orange-500/20 transform hover:scale-105 transition-all duration-500">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R-HOME-RECIPE-NPolbggqYID8WgHIkp3II4ltL0oLZR.png"
                alt="Ultimative Feuer-Burger"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <Badge className="bg-green-600 text-white font-bold px-3 py-1 mb-4">Empfohlen vom Chef</Badge>
                <h4 className="text-3xl font-bold text-white mb-2">Ultimative Feuer-Burger</h4>
                <p className="text-gray-200 mb-4 max-w-lg">
                  Ein saftiger Burger mit karamellisierten Zwiebeln und unserer Green Chili Sauce für den perfekten Kick
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>35 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span>4 Portionen</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>Mittel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🌶️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Empfohlene Sauce</p>
                    <p className="font-bold text-green-500">Big Red's Green Chili</p>
                  </div>
                </div>
                <Button
                  onClick={() => openRecipeModal(recipes[0])}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Rezept ansehen
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-lg font-bold text-orange-400 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Hauptzutaten
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                      <span>Hochwertige Rindfleisch-Patties</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                      <span>Brioche-Burgerbrötchen</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                      <span>Karamellisierte Zwiebeln</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                      <span>Gereifter Cheddar-Käse</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                      <span>Big Red's Green Chili Sauce</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-orange-400 mb-3 flex items-center">
                    <Utensils className="w-4 h-4 mr-2" />
                    Zubereitungsschritte
                  </h5>
                  <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                    <li>Zwiebeln karamellisieren</li>
                    <li>Burger-Patties würzen und grillen</li>
                    <li>Käse schmelzen lassen</li>
                    <li>Brötchen mit Green Chili Sauce bestreichen</li>
                    <li>Alle Zutaten schichten und servieren</li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs">
                        👨‍🍳
                      </div>
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs">
                        👩‍🍳
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                        👨‍🍳
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">+120 Personen haben dieses Rezept ausprobiert</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-400 ml-1">(4.9)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Recipes */}
          <div className="space-y-8">
            <h4 className="text-2xl font-bold text-white mb-6">Weitere köstliche Rezepte</h4>

            {/* Recipe Card 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <img
                    src="/mexican-tacos-with-beef-tomato-sauce-salsa.jpg"
                    alt="Feurige Tacos al Pastor"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">Heat Wave</Badge>
                </div>
                <div className="md:w-2/3 p-6">
                  <h5 className="text-xl font-bold text-white mb-2">Feurige Tacos al Pastor</h5>
                  <p className="text-gray-300 text-sm mb-4">
                    Traditionelle mexikanische Tacos mit marinierten Schweinefleisch und unserer Heat Wave Sauce
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>55 min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>6 Portionen</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Fortgeschritten</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => openRecipeModal(recipes[1])}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm"
                  >
                    <BookOpen className="w-3 h-3 mr-2" />
                    Rezept ansehen
                  </Button>
                </div>
              </div>
            </div>

            {/* Vegetarian Recipe Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <img
                    src="/mexican-chicken-quesadillas-with-cheese-peppers-wooden-table.jpg"
                    alt="Mediterrane Gemüse-Quesadillas"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">Vegetarisch</Badge>
                </div>
                <div className="md:w-2/3 p-6">
                  <h5 className="text-xl font-bold text-white mb-2">Mediterrane Gemüse-Quesadillas</h5>
                  <p className="text-gray-300 text-sm mb-4">
                    Knusprige Quesadillas mit gegrilltem Gemüse und unserer Smoky Chipotle Sauce
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>35 min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>4 Portionen</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Einfach</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => openRecipeModal(recipes[2])}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm"
                  >
                    <BookOpen className="w-3 h-3 mr-2" />
                    Rezept ansehen
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRecipe.image || "/placeholder.svg"}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedRecipe.title}</h2>
                <p className="text-gray-200">{selectedRecipe.description}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Vorbereitung</p>
                  <p className="text-white font-semibold">{selectedRecipe.prepTime}</p>
                </div>
                <div className="text-center">
                  <Utensils className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Kochzeit</p>
                  <p className="text-white font-semibold">{selectedRecipe.cookTime}</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Portionen</p>
                  <p className="text-white font-semibold">{selectedRecipe.servings}</p>
                </div>
                <div className="text-center">
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Schwierigkeit</p>
                  <p className="text-white font-semibold">{selectedRecipe.difficulty}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Empfohlene Sauce</h3>
                <p className="text-white">{selectedRecipe.sauce}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-orange-400" />
                    Zutaten
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-orange-400" />
                    Zubereitung
                  </h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3 text-gray-300">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700 flex justify-center">
                <Button
                  onClick={() => setSelectedRecipe(null)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8"
                >
                  Modal schließen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
