export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function POST(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const fd = await req.formData()
  const name = fd.get('name')?.toString() || ''
  const description = fd.get('description')?.toString() || ''
  if (!name) return setSession(NextResponse.json({ success: false, error: 'Nombre requerido' }, { status: 400 }), sid)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  if (store.categories.find((c: any) => c.slug === slug)) return setSession(NextResponse.json({ success: false, error: 'Categoría ya existe' }, { status: 400 }), sid)
  const cat = { id: store.nextIds.category++, slug, name, description, created_at: new Date().toISOString() }
  store.categories.push(cat)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Categoría añadida', category: cat }), sid)
}
