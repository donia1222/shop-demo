"use client"

import { ShoppingCart, Plus, Minus, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  heatLevel: number
  rating: number
  badge?: string
  origin?: string
}

interface CartItem extends Product {
  quantity: number
  image_url?: string
}

interface ShoppingCartProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  onAddToCart: (product: Product) => void
  onRemoveFromCart: (productId: number) => void
  onGoToCheckout: () => void
  onClearCart: () => void
}

export function ShoppingCartComponent({
  isOpen,
  onOpenChange,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onGoToCheckout,
  onClearCart,
}: ShoppingCartProps) {
  const MINIMUM_ORDER_AMOUNT = 0


  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const isMinimumOrderMet = () => {
    return getTotalPrice() >= MINIMUM_ORDER_AMOUNT
  }

  const getRemainingAmount = () => {
    return Math.max(0, MINIMUM_ORDER_AMOUNT - getTotalPrice())
  }

  // Función mejorada para manejar el checkout con scroll
  const handleGoToCheckout = () => {
    // Primero hacer scroll a la sección de ofertas
    const offersSection = document.getElementById('offers')
    if (offersSection) {
      offersSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
    
    // Pequeño delay para que el scroll termine antes de navegar
    setTimeout(() => {
      onGoToCheckout()
    }, 500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="bg-slate-900 border-orange-500/20 w-full sm:w-[400px] flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b border-orange-500/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-orange-400 text-lg sm:text-xl">Einkaufswagen</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">Ihr Warenkorb ist leer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                // Build the proper image URL - prioritize full URL first, then build from filename
                const imageUrl = item.image_url || 
                  (item.image && item.image.startsWith('http') ? item.image : 
                   (item.image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${item.image}` : 
                    "/placeholder.svg"));
                
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-orange-500/20"
                  >
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        console.log(`❌ Image load error for ${item.name}:`, imageUrl);
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                      onLoad={() => {
                        console.log(`✅ Image loaded successfully for ${item.name}:`, imageUrl);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-2 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-orange-400 font-bold text-sm sm:text-base">{item.price.toFixed(2)} CHF</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 hover:bg-red-700 border-red-500 p-0"
                        onClick={() => onRemoveFromCart(item.id)}
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-white font-bold text-sm">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 hover:bg-green-700 border-green-500 p-0"
                        onClick={() => onAddToCart(item)}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-orange-500/20 p-4 bg-slate-900 flex-shrink-0">
            <div className="flex justify-between items-center text-lg sm:text-xl font-bold mb-3">
              <span className="text-white">Total:</span>
              <span className="text-orange-400">{getTotalPrice().toFixed(2)} CHF</span>
            </div>

            {/* Minimum order warning */}
            {!isMinimumOrderMet() && (
              <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-3 mb-3">
                <p className="text-yellow-300 text-xs sm:text-sm text-center font-semibold">
                  ⚠️ Mindestbestellwert: {MINIMUM_ORDER_AMOUNT} CHF
                </p>
                <p className="text-yellow-200 text-xs text-center mt-1">
                  Noch {getRemainingAmount().toFixed(2)} CHF bis zum kostenlosen Versand
                </p>
              </div>
            )}

            {/* Free shipping confirmation */}
            {isMinimumOrderMet() && (
              <div className="bg-green-900/50 border border-green-600 rounded-lg p-3 mb-3">
                <p className="text-green-300 text-xs sm:text-sm text-center font-semibold">
                  ✅ Kostenloser Versand aktiviert!
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleGoToCheckout}
                disabled={cart.length === 0 || !isMinimumOrderMet()}
                className={`w-full font-bold py-2.5 sm:py-3 text-sm sm:text-lg transition-all duration-300 ${
                  isMinimumOrderMet()
                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white transform hover:scale-105"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed hover:bg-gray-600"
                }`}
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="truncate">
                  {isMinimumOrderMet() ? "Zur Kasse gehen" : `Mindestens ${MINIMUM_ORDER_AMOUNT} CHF erforderlich`}
                </span>
              </Button>

              {/* Clear cart button */}
              <Button
                onClick={onClearCart}
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white py-2 text-sm"
              >
                🗑️ Warenkorb leeren
              </Button>

              <p className="text-xs text-gray-400 text-center leading-tight">
                {isMinimumOrderMet()
                  ? "✅ Kostenloser Versand • Sichere Zahlung mit PayPal"
                  : `Kostenloser Versand ab ${MINIMUM_ORDER_AMOUNT} CHF • Sichere Zahlung mit PayPal`}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}