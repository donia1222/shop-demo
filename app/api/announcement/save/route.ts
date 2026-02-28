export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
import fs from 'fs'; import path from 'path'
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'demo-uploads')
async function saveFile(file: File, sid: string): Promise<string> {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${sid}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()))
  return `/demo-uploads/${filename}`
}
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function POST(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const now = new Date().toISOString()
  let id: number | null = null, title = '', text = '', is_active = false
  let img1: string|null = null, img2: string|null = null
  try {
    const fd = await req.formData()
    const rawId = fd.get('id')?.toString(); id = rawId ? parseInt(rawId) : null
    title = fd.get('title')?.toString() || ''; text = fd.get('text')?.toString() || ''
    const active = fd.get('is_active')?.toString(); is_active = active === '1' || active === 'true'
    const f1 = fd.get('image1'); if (f1 instanceof File && f1.size > 0) img1 = await saveFile(f1, sid)
    const f2 = fd.get('image2'); if (f2 instanceof File && f2.size > 0) img2 = await saveFile(f2, sid)
  } catch {}
  if (id) {
    const idx = store.announcements.findIndex((a: any) => a.id === id)
    if (idx !== -1) {
      const a: any = store.announcements[idx]
      if (title) a.title = title; if (text) a.text = text; a.is_active = is_active
      if (img1) { a.image1 = img1; a.image1_url = img1 }
      if (img2) { a.image2 = img2; a.image2_url = img2 }
    }
  } else {
    store.announcements.push({ id: store.nextIds.announcement++, title, text, is_active, show_once: false, image1: img1, image1_url: img1, image2: img2, image2_url: img2, created_at: now } as any)
  }
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Anuncio guardado' }), sid)
}
export async function DELETE(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const id = parseInt(req.nextUrl.searchParams.get('id') || '0')
  store.announcements = store.announcements.filter((a: any) => a.id !== id)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Anuncio eliminado' }), sid)
}
