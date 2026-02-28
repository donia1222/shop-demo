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
  let title = '', content = '', excerpt = '', heroUrl: string|null = null, img2: string|null = null, img3: string|null = null, img4: string|null = null
  try {
    const fd = await req.formData()
    title = fd.get('title')?.toString() || ''; content = fd.get('content')?.toString() || ''; excerpt = fd.get('excerpt')?.toString() || ''
    const h = fd.get('hero_image'); if (h instanceof File && h.size > 0) heroUrl = await saveFile(h, sid)
    const f2 = fd.get('image2'); if (f2 instanceof File && f2.size > 0) img2 = await saveFile(f2, sid)
    const f3 = fd.get('image3'); if (f3 instanceof File && f3.size > 0) img3 = await saveFile(f3, sid)
    const f4 = fd.get('image4'); if (f4 instanceof File && f4.size > 0) img4 = await saveFile(f4, sid)
  } catch {}
  const post: any = { id: store.nextIds.blog++, title, content, excerpt, hero_image: heroUrl, hero_image_url: heroUrl, image2: img2, image2_url: img2, image3: img3, image3_url: img3, image4: img4, image4_url: img4, created_at: now, updated_at: now }
  store.blog_posts.push(post)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Post añadido', id: post.id }), sid)
}
