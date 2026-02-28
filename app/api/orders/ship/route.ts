export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function POST(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  let data: any = {}
  try { data = await req.json() } catch {}
  const id = parseInt(data.orderId || '0')
  const idx = store.orders.findIndex((o: any) => o.id === id)
  if (idx !== -1) { store.orders[idx].status = 'completed'; store.orders[idx].updated_at = new Date().toISOString() }
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Notificación enviada (demo)' }), sid)
}
