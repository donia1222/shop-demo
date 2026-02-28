export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function POST(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const body = await req.text()
  const params = new URLSearchParams(body)
  const id = parseInt(params.get('id') || '0')
  store.categories = store.categories.filter((c: any) => c.id !== id)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Categoría eliminada' }), sid)
}
