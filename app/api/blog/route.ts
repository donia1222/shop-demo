export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, createSessionId } from '@/lib/demo-store'
function getSessionId(req: NextRequest) { return req.cookies.get('demo-session')?.value || createSessionId() }
function setSession(res: NextResponse, sid: string) { res.cookies.set('demo-session', sid, { path: '/', maxAge: 60*60*24*365, httpOnly: false, sameSite: 'lax' }); return res }
export async function GET(req: NextRequest) {
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const id = req.nextUrl.searchParams.get('id')
  if (id) { const post = store.blog_posts.find((p: any) => p.id === parseInt(id)); if (!post) return setSession(NextResponse.json({ success: false, error: 'Not found' }, { status: 404 }), sid); return setSession(NextResponse.json({ success: true, post }), sid) }
  return setSession(NextResponse.json({ success: true, posts: store.blog_posts, total: store.blog_posts.length }), sid)
}
