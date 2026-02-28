"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent")
    if (!accepted) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie-consent", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-xl">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-lg px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
        <p className="text-sm text-[#999] flex-1">
          Wir verwenden Cookies, um Ihr Erlebnis zu verbessern.{" "}
          <span className="text-[#666]">Durch die weitere Nutzung stimmen Sie zu.</span>
        </p>
        <Button
          onClick={accept}
          size="sm"
          className="bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-full px-4 flex-shrink-0"
        >
          OK
        </Button>
        <button
          onClick={accept}
          className="text-[#555] hover:text-[#999] flex-shrink-0"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
