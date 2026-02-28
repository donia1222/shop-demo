export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId } from '@/lib/demo-store'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'demo-uploads')
function ensureUploadDir() { if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true }) }
async function saveFile(file: File, sid: string): Promise<string> {
  ensureUploadDir()
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
  let image_url = ''; let title = ''; let description = ''
  try {
    const fd = await req.formData()
    title = fd.get('title')?.toString() || ''
    description = fd.get('description')?.toString() || ''
    const imgFile = fd.get('image')
    if (imgFile instanceof File && imgFile.size > 0) {
      image_url = await saveFile(imgFile, sid)
    } else {
      image_url = fd.get('image_url')?.toString() || ''
    }
  } catch {}
  const img = { id: store.nextIds.gallery++, image: image_url, image_url, title, description, created_at: new Date().toISOString() }
  store.gallery_images.push(img)
  saveStore(sid, store)
  return setSession(NextResponse.json({ success: true, message: 'Imagen añadida', id: img.id }), sid)
}
