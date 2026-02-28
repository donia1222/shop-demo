export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateStore, saveStore, createSessionId } from "@/lib/demo-store"

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "No se proporcionaron IDs" }, { status: 400 })
    }

    const sid = request.cookies.get('demo-session')?.value || createSessionId()
    const store = getOrCreateStore(sid)

    const numericIds = ids.map((id: any) => parseInt(String(id), 10)).filter((id: number) => !isNaN(id))
    store.products = store.products.filter((p: any) => !numericIds.includes(p.id))
    saveStore(sid, store)

    const res = NextResponse.json({ success: true, message: `${numericIds.length} Produkte gelöscht`, deleted: numericIds.length })
    res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' })
    return res
  } catch (error) {
    console.error("Error eliminando importación:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
