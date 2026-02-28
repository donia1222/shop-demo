export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function GET(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const active = req.nextUrl.searchParams.get('active')
  if (active) { const ann = store.announcements.find((a: any) => a.is_active); return setSession(NextResponse.json({ success: true, announcement: ann || null }), sid) }
  return setSession(NextResponse.json({ success: true, announcements: store.announcements, total: store.announcements.length }), sid)
}
