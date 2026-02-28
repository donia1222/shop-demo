export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  // Demo mode: return a fake client secret
  return NextResponse.json({ clientSecret: 'demo_pi_fake_secret_' + Date.now() + '_secret_demo' })
}
