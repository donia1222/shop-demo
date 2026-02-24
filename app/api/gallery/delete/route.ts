import { NextRequest, NextResponse } from "next/server"

const PHP_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/delete_gallery_image.php"

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    const res = await fetch(`${PHP_URL}?id=${id}&_method=DELETE`, {
      method: "DELETE",
      cache: "no-store",
    })
    const text = await res.text()
    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ success: false, error: text.slice(0, 300) }, { status: 502 })
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
