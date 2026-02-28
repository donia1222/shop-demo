export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, createSessionId } from '@/lib/demo-store'

function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }

const IMG_BASE = 'https://web.lweb.ch/templettedhop/upload/'
function enrichProduct(p: any) {
  const url = p.image ? (p.image.startsWith('http') ? p.image : IMG_BASE + p.image) : null
  return { ...p, image_url: p.image_url || url, image_url_candidates: p.image_url_candidates?.length ? p.image_url_candidates : (url ? [url] : []), stock_status: p.stock === 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock', weight_kg: p.weight_kg ?? 0.5 }
}

export async function GET(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const sp = req.nextUrl.searchParams
  const id = sp.get('id'); const search = sp.get('search') || ''; const category = sp.get('category') || ''; const stock_status = sp.get('stock_status') || ''

  if (id) {
    const p = store.products.find((x: any) => x.id === parseInt(id))
    if (!p) return setSession(NextResponse.json({ success: false, error: 'Not found' }, { status: 404 }), sid)
    return setSession(NextResponse.json({ success: true, product: enrichProduct(p) }), sid)
  }

  let products = [...store.products]
  if (search) products = products.filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()))
  if (category) products = products.filter((p: any) => p.category === category)
  if (stock_status === 'in_stock') products = products.filter((p: any) => p.stock > 0)
  else if (stock_status === 'out_of_stock') products = products.filter((p: any) => p.stock === 0)
  else if (stock_status === 'low_stock') products = products.filter((p: any) => p.stock > 0 && p.stock <= 10)

  const enriched = products.map(enrichProduct)
  const res = NextResponse.json({ success: true, products: enriched, total: enriched.length, stats: { total_products: enriched.length, hot_sauces: enriched.filter((p: any) => p.category === 'hot-sauce').length, bbq_sauces: enriched.filter((p: any) => p.category === 'bbq-sauce').length, total_stock: enriched.reduce((s: number, p: any) => s + (p.stock || 0), 0), out_of_stock: enriched.filter((p: any) => p.stock === 0).length, low_stock: enriched.filter((p: any) => p.stock > 0 && p.stock <= 10).length, in_stock: enriched.filter((p: any) => p.stock > 0).length } })
  return setSession(res, sid)
}
