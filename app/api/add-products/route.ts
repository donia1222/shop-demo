export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { getOrCreateStore, saveStore, createSessionId } from "@/lib/demo-store"

function toSlug(sheetName: string): string {
  return sheetName
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getCol(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key]
    }
  }
  return undefined
}

function transformImageUrl(url: string): string {
  if (!url) return ""
  return url.replace(
    /^https?:\/\/usfh\.ch\/img\/([^/]+)\//i,
    (_, folder) => `https://web.lweb.ch/usa/img/${folder.toLowerCase()}/`
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No se recibió ningún archivo" }, { status: 400 })
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ success: false, error: "El archivo debe ser .xlsx o .xls" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })

    const allProducts: any[] = []

    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" })

      const categorySlug = toSlug(sheetName)
      const categoryName = sheetName.trim()

      const artikelToUrl = new Map<string, string>()
      const sheetRef = ws["!ref"]
      if (sheetRef) {
        const range = XLSX.utils.decode_range(sheetRef)
        let artikelCol = -1
        for (let c = range.s.c; c <= range.e.c; c++) {
          const h = (ws[XLSX.utils.encode_cell({ r: range.s.r, c })] as any)?.v
          if (h === "Artikel-Nr.") { artikelCol = c; break }
        }
        if (artikelCol >= 0) {
          for (let r = range.s.r + 1; r <= range.e.r; r++) {
            const artCell = ws[XLSX.utils.encode_cell({ r, c: artikelCol })] as any
            if (!artCell) continue
            const artNr = String(artCell.v ?? "").trim()
            if (!artNr) continue
            for (let c = range.s.c; c <= range.e.c; c++) {
              const cell = ws[XLSX.utils.encode_cell({ r, c })] as any
              if (!cell) continue
              const val = String(cell.v ?? cell.l?.Target ?? cell.f ?? "").trim()
              if (val.toLowerCase().includes("usfh.ch/img")) {
                artikelToUrl.set(artNr, val)
                break
              }
            }
          }
        }
      }

      for (const row of rows) {
        const id = getCol(row, "Artikel-Nr.", "ID", "id")
        const name = getCol(row, "Name", "name")

        if (!id || !name) continue

        const numId = parseInt(String(id), 10)
        if (isNaN(numId) || numId <= 0) continue

        const price = parseFloat(String(getCol(row, "Preis inkl. MwSt.", "Preis zzgl. MwSt.") ?? 0)) || 0
        const stock = parseInt(String(getCol(row, "Lager", "Lagerbestand") ?? 0), 10) || 0
        const description = String(getCol(row, "Beschreibung") ?? "").trim()
        const supplier = String(getCol(row, "Lieferant") ?? "").trim()
        const origin = String(getCol(row, "Hersteller") ?? "").trim()

        const artikelNr = String(id).trim()
        const rawImage = artikelToUrl.get(artikelNr)
          || String(getCol(row, "URLs der Bilder", "Bild", "Bild URL", "Image", "image_url", "Foto") ?? "").trim()
        const folder = categorySlug.split("-")[0]
        const image_url = rawImage
          ? transformImageUrl(rawImage).replace(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/, "")
          : `https://web.lweb.ch/usa/img/${folder}/${artikelNr}`

        allProducts.push({
          id: numId,
          name: String(name).trim(),
          description,
          price,
          stock,
          supplier,
          origin,
          category: categorySlug,
          category_name: categoryName,
          image_url,
        })
      }
    }

    if (allProducts.length === 0) {
      return NextResponse.json({ success: false, error: "No se encontraron productos válidos en el archivo" }, { status: 400 })
    }

    // Add to demo store (does NOT delete existing products)
    const sid = request.cookies.get('demo-session')?.value || createSessionId()
    const store = getOrCreateStore(sid)
    const now = new Date().toISOString()

    let added = 0
    let updated = 0

    for (const p of allProducts) {
      const existingIdx = store.products.findIndex((ep: any) => ep.id === p.id)
      const enriched = {
        ...p,
        heat_level: p.heat_level || 1,
        rating: p.rating || 4.5,
        badge: p.badge || '',
        weight_kg: p.weight_kg || 0.5,
        image: p.image_url || '',
        image_url: p.image_url || '',
        image_url_candidates: p.image_url ? [p.image_url] : [],
        stock_status: p.stock === 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock',
        created_at: now,
        updated_at: now,
      }
      if (existingIdx >= 0) {
        store.products[existingIdx] = { ...store.products[existingIdx], ...enriched, updated_at: now }
        updated++
      } else {
        store.products.push(enriched)
        added++
      }

      // Ensure category exists
      if (!store.categories.find((c: any) => c.slug === p.category)) {
        store.categories.push({
          id: store.nextIds.category++,
          slug: p.category,
          name: p.category_name || p.category,
          description: '',
          created_at: now,
        })
      }
    }

    saveStore(sid, store)

    const res = NextResponse.json({
      success: true,
      message: `${added} Produkte hinzugefügt, ${updated} aktualisiert`,
      parsed: allProducts.length,
      added,
      updated,
    })
    res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' })
    return res
  } catch (error) {
    console.error("Error añadiendo productos:", error)
    return NextResponse.json({ success: false, error: "Error interno al procesar el archivo" }, { status: 500 })
  }
}
