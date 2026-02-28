export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function DELETE(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const id = parseInt(req.nextUrl.searchParams.get('id') || '0')
  store.gallery_images = store.gallery_images.filter((img: any) => img.id !== id)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Imagen eliminada' }), sid)
}
