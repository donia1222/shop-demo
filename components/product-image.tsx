"use client"

import { useState, useEffect } from "react"

const EXTENSIONS = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".webp"]
const HAS_EXT = /\.(jpg|jpeg|png|gif|webp|svg)$/i
const PLACEHOLDER = "/placeholder.svg"

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string | null | undefined
  candidates?: string[]
  alt: string
  onAllFailed?: () => void
}

export function ProductImage({ src, candidates, alt, onAllFailed, ...props }: ProductImageProps) {
  const urls: string[] = candidates && candidates.length > 0
    ? candidates
    : src
      ? HAS_EXT.test(src)
        ? [src]
        : EXTENSIONS.map(ext => src + ext)
      : []

  const [attempt, setAttempt] = useState(0)

  const allFailed = urls.length === 0 || attempt >= urls.length

  useEffect(() => {
    if (allFailed && onAllFailed) onAllFailed()
  }, [allFailed, onAllFailed])

  if (allFailed) {
    return <img src={PLACEHOLDER} alt={alt} {...props} />
  }

  return (
    <img
      src={urls[attempt]}
      alt={alt}
      loading="lazy"
      onError={() => setAttempt(a => a + 1)}
      {...props}
    />
  )
}
