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
  let id = 0, title = '', content = '', excerpt = ''
  const imgUpdates: Record<string, string|null> = {}
  try {
    const fd = await req.formData()
    id = parseInt(fd.get('id')?.toString() || '0'); title = fd.get('title')?.toString() || ''; content = fd.get('content')?.toString() || ''; excerpt = fd.get('excerpt')?.toString() || ''
    for (const key of ['hero_image','image2','image3','image4']) {
      const f = fd.get(key); if (f instanceof File && f.size > 0) imgUpdates[key] = await saveFile(f, sid)
    }
  } catch {}
  const idx = store.blog_posts.findIndex((p: any) => p.id === id)
  if (idx === -1) return setSession(NextResponse.json({ success: false, error: 'Post no encontrado' }, { status: 404 }), sid)
  const p: any = store.blog_posts[idx]
  if (title) p.title = title
  if (content) p.content = content
  if (excerpt !== undefined) p.excerpt = excerpt
  for (const [key, url] of Object.entries(imgUpdates)) { p[key] = url; p[key + '_url'] = url }
  p.updated_at = new Date().toISOString()
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Post actualizado' }), sid)
}
export async function DELETE(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const id = parseInt(req.nextUrl.searchParams.get('id') || '0')
  store.blog_posts = store.blog_posts.filter((p: any) => p.id !== id)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Post eliminado' }), sid)
}
