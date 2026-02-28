export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function POST(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const fd = await req.formData()
  const id = parseInt(fd.get('id')?.toString() || '0')
  const idx = store.categories.findIndex((c: any) => c.id === id)
  if (idx === -1) return setSession(NextResponse.json({ success: false, error: 'Categoría no encontrada' }, { status: 404 }), sid)
  const name = fd.get('name')?.toString(); const description = fd.get('description')?.toString()
  if (name) store.categories[idx].name = name
  if (description !== undefined) store.categories[idx].description = description
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Categoría actualizada' }), sid)
}
