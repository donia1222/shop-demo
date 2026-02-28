export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStore, saveStore, createSessionId, Store } from '@/lib/demo-store'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'demo-uploads')

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

async function saveUploadedFile(file: File, sessionId: string): Promise<string> {
  ensureUploadDir()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${sessionId}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer)
  return `/demo-uploads/${filename}`
}

async function parseFormDataWithFiles(req: NextRequest): Promise<{ fields: Record<string, string>; files: Record<string, File> }> {
  const fields: Record<string, string> = {}
  const files: Record<string, File> = {}
  try {
    const fd = await req.formData()
    fd.forEach((value, key) => {
      if (value instanceof File && value.size > 0) {
        files[key] = value
      } else if (typeof value === 'string') {
        fields[key] = value
      }
    })
  } catch {}
  return { fields, files }
}

const IMG_BASE = 'https://web.lweb.ch/templettedhop/upload/'

function getSessionId(req: NextRequest): string {
  return req.cookies.get('demo-session')?.value || createSessionId()
}

function json(data: unknown, sessionId: string, status = 200) {
  const res = NextResponse.json(data, { status })
  res.cookies.set('demo-session', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 365, httpOnly: false, sameSite: 'lax' })
  return res
}

function buildImageUrls(filename: string | null) {
  if (!filename) return { image_url: null, image_url_candidates: [] }
  if (filename.startsWith('http')) return { image_url: filename, image_url_candidates: [filename] }
  const url = IMG_BASE + filename
  const base = url.replace(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i, '')
  const hasExt = /\.(jpg|jpeg|png|webp)$/i.test(url)
  return {
    image_url: url,
    image_url_candidates: hasExt ? [url] : [base+'.jpg', base+'.JPG', base+'.jpeg', base+'.png', base+'.webp'],
  }
}

function enrichProduct(p: any) {
  const imgs = buildImageUrls(p.image || null)
  return {
    ...p,
    image_url: p.image_url || imgs.image_url,
    image_url_candidates: p.image_url_candidates?.length ? p.image_url_candidates : imgs.image_url_candidates,
    stock_status: p.stock === 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock',
    weight_kg: p.weight_kg ?? 0.5,
  }
}

function orderStats(store: Store) {
  const orders = store.orders
  return {
    total_orders: orders.length,
    total_revenue: orders.reduce((s: number, o: any) => s + o.total_amount, 0),
    completed_orders: orders.filter((o: any) => o.status === 'completed').length,
    pending_orders: orders.filter((o: any) => o.status === 'pending').length,
    processing_orders: orders.filter((o: any) => o.status === 'processing').length,
    cancelled_orders: orders.filter((o: any) => o.status === 'cancelled').length,
  }
}

async function formDataToObj(req: NextRequest): Promise<Record<string, string>> {
  try {
    const fd = await req.formData()
    const obj: Record<string, string> = {}
    fd.forEach((v, k) => { if (typeof v === 'string') obj[k] = v })
    return obj
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const endpoint = resolvedParams.path.join('/')
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const sp = req.nextUrl.searchParams

  // get_products.php
  if (endpoint === 'get_products.php') {
    const id = sp.get('id')
    const search = sp.get('search') || ''
    const category = sp.get('category') || ''
    const stock_status = sp.get('stock_status') || ''

    if (id) {
      const p = store.products.find((x: any) => x.id === parseInt(id))
      if (!p) return json({ success: false, error: 'Producto no encontrado' }, sid, 404)
      return json({ success: true, product: enrichProduct(p) }, sid)
    }

    let products = [...store.products]
    if (search) products = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    if (category) products = products.filter((p: any) => p.category === category)
    if (stock_status === 'in_stock') products = products.filter((p: any) => p.stock > 0)
    else if (stock_status === 'out_of_stock') products = products.filter((p: any) => p.stock === 0)
    else if (stock_status === 'low_stock') products = products.filter((p: any) => p.stock > 0 && p.stock <= 10)

    const enriched = products.map(enrichProduct)
    const hot = enriched.filter((p: any) => p.category === 'hot-sauce' || !p.category)
    const bbq = enriched.filter((p: any) => p.category === 'bbq-sauce')
    const total_stock = enriched.reduce((s: number, p: any) => s + (p.stock || 0), 0)

    return json({
      success: true,
      products: enriched,
      total: enriched.length,
      stats: {
        total_products: enriched.length,
        hot_sauces: hot.length,
        bbq_sauces: bbq.length,
        total_stock,
        out_of_stock: enriched.filter((p: any) => p.stock === 0).length,
        low_stock: enriched.filter((p: any) => p.stock > 0 && p.stock <= 10).length,
        in_stock: enriched.filter((p: any) => p.stock > 0).length,
      }
    }, sid)
  }

  // get_categories.php
  if (endpoint === 'get_categories.php') {
    return json({ success: true, categories: store.categories, total: store.categories.length }, sid)
  }

  // get_orders.php
  if (endpoint === 'get_orders.php') {
    const page = parseInt(sp.get('page') || '1')
    const limit = Math.min(50, parseInt(sp.get('limit') || '20'))
    const status = sp.get('status')
    const email = sp.get('email')
    const search = sp.get('search')
    const offset = (page - 1) * limit

    let orders = [...store.orders]
    if (status) orders = orders.filter((o: any) => o.status === status)
    if (email) orders = orders.filter((o: any) => o.customer_email.includes(email))
    if (search) orders = orders.filter((o: any) =>
      o.customer_first_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_last_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase())
    )

    orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const paginated = orders.slice(offset, offset + limit)
    const stats = orderStats(store)
    const total_pages = Math.max(1, Math.ceil(orders.length / limit))

    return json({
      success: true,
      data: paginated,
      orders: paginated,
      total: orders.length,
      page,
      limit,
      pagination: { total_pages, total_orders: orders.length, current_page: page, per_page: limit },
      stats,
      ...stats,
    }, sid)
  }

  // get_ordersuser.php
  if (endpoint === 'get_ordersuser.php') {
    const token = sp.get('token') || req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return json({ success: false, error: 'No token' }, sid, 401)
    const user = store.users.find((u: any) => u.session_token === token)
    if (!user) return json({ success: false, error: 'Invalid session' }, sid, 401)
    const orders = store.orders.filter((o: any) => o.user_id === user.id)
    return json({ success: true, orders }, sid)
  }

  // get_user.php
  if (endpoint === 'get_user.php') {
    const token = sp.get('token')
    if (!token) return json({ success: false, error: 'No token' }, sid, 401)
    const user = store.users.find((u: any) => u.session_token === token)
    if (!user) return json({ success: false, error: 'Invalid session' }, sid, 401)
    return json({ success: true, user, orderStats: { total_orders: 0, total_spent: 0 }, recentOrders: [] }, sid)
  }

  // get_blog_posts.php
  if (endpoint === 'get_blog_posts.php') {
    const id = sp.get('id')
    if (id) {
      const post = store.blog_posts.find((p: any) => p.id === parseInt(id))
      if (!post) return json({ success: false, error: 'Post no encontrado' }, sid, 404)
      return json({ success: true, post }, sid)
    }
    return json({ success: true, posts: store.blog_posts, total: store.blog_posts.length }, sid)
  }

  // get_gallery_images.php
  if (endpoint === 'get_gallery_images.php') {
    return json({ success: true, images: store.gallery_images, total: store.gallery_images.length }, sid)
  }

  // get_announcement.php
  if (endpoint === 'get_announcement.php') {
    const active = sp.get('active')
    if (active) {
      const ann = store.announcements.find((a: any) => a.is_active)
      return json({ success: true, announcement: ann || null }, sid)
    }
    return json({ success: true, announcements: store.announcements, total: store.announcements.length }, sid)
  }

  // get_payment_settings.php
  if (endpoint === 'get_payment_settings.php') {
    return json({ success: true, settings: store.payment_settings }, sid)
  }

  // get_shipping_settings.php
  if (endpoint === 'get_shipping_settings.php') {
    return json({ success: true, ...store.shipping }, sid)
  }

  return json({ success: false, error: `Unknown endpoint: ${endpoint}` }, sid, 404)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const endpoint = resolvedParams.path.join('/')
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const now = new Date().toISOString()

  // add_product.php
  if (endpoint === 'add_product.php') {
    const { fields: fd, files } = await parseFormDataWithFiles(req)
    // Guardar imagen principal (image_0 o image)
    let imageUrl = fd.image_url || ''
    const imgFile = files['image_0'] || files['image']
    if (imgFile) imageUrl = await saveUploadedFile(imgFile, sid)
    // Guardar imágenes adicionales
    const extraUrls: (string | null)[] = [null, null, null]
    for (let i = 1; i <= 3; i++) {
      const f = files[`image_${i}`]
      if (f) extraUrls[i - 1] = await saveUploadedFile(f, sid)
    }
    const newProduct: any = {
      id: store.nextIds.product++,
      name: fd.name || 'Neues Produkt',
      description: fd.description || '',
      price: parseFloat(fd.price || '0'),
      image: imageUrl,
      image_url: imageUrl,
      image_url_candidates: imageUrl ? [imageUrl] : [],
      image2: extraUrls[0],
      image3: extraUrls[1],
      image4: extraUrls[2],
      heat_level: parseInt(fd.heat_level || '1'),
      rating: parseFloat(fd.rating || '4.5'),
      badge: fd.badge || '',
      origin: fd.origin || '',
      category: fd.category || 'hot-sauce',
      stock: parseInt(fd.stock || '10'),
      weight_kg: parseFloat(fd.weight_kg || '0.5'),
      created_at: now,
      updated_at: now,
    }
    store.products.push(enrichProduct(newProduct))
    saveStore(sid, store)
    return json({ success: true, message: 'Producto añadido', id: newProduct.id }, sid)
  }

  // edit_product.php
  if (endpoint === 'edit_product.php') {
    const { fields: fd, files } = await parseFormDataWithFiles(req)
    const id = parseInt(fd.id || '0')
    const idx = store.products.findIndex((p: any) => p.id === id)
    if (idx === -1) return json({ success: false, error: 'Producto no encontrado' }, sid, 404)
    const updated: any = { ...store.products[idx] }
    if (fd.name !== undefined) updated.name = fd.name
    if (fd.description !== undefined) updated.description = fd.description
    if (fd.price !== undefined) updated.price = parseFloat(fd.price)
    if (fd.heat_level !== undefined) updated.heat_level = parseInt(fd.heat_level)
    if (fd.rating !== undefined) updated.rating = parseFloat(fd.rating)
    if (fd.badge !== undefined) updated.badge = fd.badge
    if (fd.origin !== undefined) updated.origin = fd.origin
    if (fd.category !== undefined) updated.category = fd.category
    if (fd.stock !== undefined) updated.stock = parseInt(fd.stock)
    if (fd.weight_kg !== undefined) updated.weight_kg = parseFloat(fd.weight_kg)
    // Manejar imágenes: 4 slots (image_0..image_3)
    const imageFields = ['image', 'image2', 'image3', 'image4'] as const
    for (let i = 0; i < 4; i++) {
      const fileKey = `image_${i}`
      const keepKey = `keep_image_${i}`
      const removeKey = `remove_image_${i}`
      const dbField = imageFields[i]
      if (files[fileKey]) {
        const url = await saveUploadedFile(files[fileKey], sid)
        updated[dbField] = url
        if (i === 0) { updated.image_url = url; updated.image_url_candidates = [url] }
      } else if (fd[removeKey] === 'true') {
        updated[dbField] = null
        if (i === 0) { updated.image_url = null; updated.image_url_candidates = [] }
      }
      // keep_image_X → no change (already in updated from spread)
    }
    updated.updated_at = now
    store.products[idx] = enrichProduct(updated)
    saveStore(sid, store)
    return json({ success: true, message: 'Producto actualizado' }, sid)
  }

  // add_category.php
  if (endpoint === 'add_category.php') {
    const fd = await formDataToObj(req)
    const name = fd.name || ''
    if (!name) return json({ success: false, error: 'Nombre requerido' }, sid, 400)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (store.categories.find((c: any) => c.slug === slug)) return json({ success: false, error: 'Categoría ya existe' }, sid, 400)
    const cat = { id: store.nextIds.category++, slug, name, description: fd.description || '', created_at: now }
    store.categories.push(cat)
    saveStore(sid, store)
    return json({ success: true, message: 'Categoría añadida', category: cat }, sid)
  }

  // edit_category.php
  if (endpoint === 'edit_category.php') {
    const fd = await formDataToObj(req)
    const id = parseInt(fd.id || '0')
    const idx = store.categories.findIndex((c: any) => c.id === id)
    if (idx === -1) return json({ success: false, error: 'Categoría no encontrada' }, sid, 404)
    if (fd.name) store.categories[idx].name = fd.name
    if (fd.description !== undefined) store.categories[idx].description = fd.description
    saveStore(sid, store)
    return json({ success: true, message: 'Categoría actualizada' }, sid)
  }

  // delete_category.php
  if (endpoint === 'delete_category.php') {
    let id = 0
    try {
      const body = await req.text()
      const p = new URLSearchParams(body)
      id = parseInt(p.get('id') || '0')
    } catch {}
    store.categories = store.categories.filter((c: any) => c.id !== id)
    saveStore(sid, store)
    return json({ success: true, message: 'Categoría eliminada' }, sid)
  }

  // add_order.php
  if (endpoint === 'add_order.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const orderNum = `ORDER_DEMO_${Date.now().toString(16).toUpperCase()}`
    const ci = data.customerInfo || {}
    const newOrder = {
      id: store.nextIds.order++,
      user_id: null,
      order_number: orderNum,
      customer_first_name: ci.firstName || '',
      customer_last_name: ci.lastName || '',
      customer_email: ci.email || '',
      customer_phone: ci.phone || '',
      customer_address: ci.address || '',
      customer_city: ci.city || '',
      customer_postal_code: ci.postalCode || '',
      customer_canton: ci.canton || '',
      customer_notes: ci.notes || '',
      total_amount: data.totalAmount || 0,
      shipping_cost: data.shippingCost || 0,
      status: 'pending',
      payment_method: data.paymentMethod || 'invoice',
      payment_status: 'pending',
      created_at: now,
      updated_at: now,
      items: (data.cart || []).map((item: any, i: number) => ({
        id: i + 1,
        product_id: item.id,
        product_name: item.name,
        product_description: item.description || '',
        product_image: item.image_url || item.image || null,
        quantity: item.quantity,
        unit_price: item.price,
        price: item.price,
        subtotal: (item.price * item.quantity),
      })),
    }
    store.orders.push(newOrder)
    saveStore(sid, store)
    return json({ success: true, message: 'Pedido creado', orderId: newOrder.id, orderNumber: orderNum }, sid)
  }

  // update_order.php
  if (endpoint === 'update_order.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const id = parseInt(data.id || '0')
    const idx = store.orders.findIndex((o: any) => o.id === id)
    if (idx === -1) return json({ success: false, error: 'Pedido no encontrado' }, sid, 404)
    if (data.status) store.orders[idx].status = data.status
    if (data.payment_status) store.orders[idx].payment_status = data.payment_status
    if (data.notes) store.orders[idx].customer_notes = data.notes
    store.orders[idx].updated_at = now
    saveStore(sid, store)
    return json({ success: true, message: 'Pedido actualizado' }, sid)
  }

  // send_shipping_notification.php
  if (endpoint === 'send_shipping_notification.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const id = parseInt(data.orderId || '0')
    const idx = store.orders.findIndex((o: any) => o.id === id)
    if (idx !== -1) { store.orders[idx].status = 'completed'; store.orders[idx].updated_at = now }
    saveStore(sid, store)
    return json({ success: true, message: 'Notificación enviada (demo)' }, sid)
  }

  // save_payment_settings.php
  if (endpoint === 'save_payment_settings.php') {
    let data: any = {}
    try { data = await req.json() } catch { const fd = await formDataToObj(req); data = fd }
    store.payment_settings = { ...store.payment_settings, ...data }
    saveStore(sid, store)
    return json({ success: true, message: 'Configuración guardada' }, sid)
  }

  // save_shipping_settings.php
  if (endpoint === 'save_shipping_settings.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    if (data.zones) store.shipping.zones = data.zones
    if (data.ranges) store.shipping.ranges = data.ranges
    if (data.rates) store.shipping.rates = data.rates
    saveStore(sid, store)
    return json({ success: true, message: 'Configuración de envío guardada' }, sid)
  }

  // save_announcement.php
  if (endpoint === 'save_announcement.php') {
    const fd = await formDataToObj(req)
    const id = fd.id ? parseInt(fd.id) : null
    if (id) {
      const idx = store.announcements.findIndex((a: any) => a.id === id)
      if (idx !== -1) {
        if (fd.title) store.announcements[idx].title = fd.title
        if (fd.text) store.announcements[idx].text = fd.text
        if (fd.is_active !== undefined) store.announcements[idx].is_active = fd.is_active === '1' || fd.is_active === 'true'
      }
    } else {
      store.announcements.push({ id: store.nextIds.announcement++, title: fd.title || '', text: fd.text || '', is_active: false, show_once: false, image1: null, image2: null, created_at: now })
    }
    saveStore(sid, store)
    return json({ success: true }, sid)
  }

  // get_user.php (POST with sessionToken in body)
  if (endpoint === 'get_user.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const token = data.sessionToken || data.token || req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return json({ success: false, error: 'No token' }, sid, 401)
    const user = store.users.find((u: any) => u.session_token === token)
    if (!user) return json({ success: false, error: 'Invalid session' }, sid, 401)
    return json({ success: true, user: { user_id: user.id, id: user.id, email: user.email, first_name: user.firstName, last_name: user.lastName, phone: user.phone, address: user.address, city: user.city, postal_code: user.postalCode, canton: user.canton, notes: user.notes }, orderStats: { total_orders: 0, total_spent: 0 }, recentOrders: [] }, sid)
  }

  // create_user.php
  if (endpoint === 'create_user.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    if (!data.email || !data.password) return json({ success: false, error: 'Email and password required' }, sid, 400)
    if (store.users.find((u: any) => u.email === data.email.toLowerCase())) return json({ success: false, error: 'Email already exists' }, sid, 400)
    const token = crypto.randomBytes(32).toString('hex')
    const user = { id: store.nextIds.user++, email: data.email.toLowerCase(), password: data.password, firstName: data.firstName || '', lastName: data.lastName || '', phone: data.phone || '', address: data.address || '', city: data.city || '', postalCode: data.postalCode || '', canton: data.canton || '', notes: data.notes || '', is_active: true, created_at: now, session_token: token }
    store.users.push(user)
    saveStore(sid, store)
    return json({ success: true, message: 'User created', user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address, city: user.city, postalCode: user.postalCode, canton: user.canton }, sessionToken: token }, sid)
  }

  // login_user.php
  if (endpoint === 'login_user.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const user = store.users.find((u: any) => u.email === data.email?.toLowerCase())
    if (!user || user.password !== data.password) return json({ success: false, error: 'Invalid email or password' }, sid, 400)
    const token = crypto.randomBytes(32).toString('hex')
    user.session_token = token
    saveStore(sid, store)
    return json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address, city: user.city, postalCode: user.postalCode, canton: user.canton }, sessionToken: token }, sid)
  }

  // delete_user.php
  if (endpoint === 'delete_user.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const token = data.sessionToken || req.headers.get('Authorization')?.replace('Bearer ', '')
    const idx = store.users.findIndex((u: any) => u.session_token === token)
    if (idx !== -1) store.users.splice(idx, 1)
    saveStore(sid, store)
    return json({ success: true, message: 'User deleted (demo)' }, sid)
  }

  // change_password.php
  if (endpoint === 'change_password.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const token = data.sessionToken || req.headers.get('Authorization')?.replace('Bearer ', '')
    const user = store.users.find((u: any) => u.session_token === token)
    if (!user) return json({ success: false, error: 'Invalid session' }, sid, 401)
    if (data.currentPassword && user.password !== data.currentPassword) return json({ success: false, error: 'Current password is wrong' }, sid, 400)
    if (data.newPassword) user.password = data.newPassword
    saveStore(sid, store)
    return json({ success: true, message: 'Password changed (demo)' }, sid)
  }

  // update_user.php
  if (endpoint === 'update_user.php') {
    let data: any = {}
    try { data = await req.json() } catch {}
    const token = data.sessionToken || req.headers.get('Authorization')?.replace('Bearer ', '')
    const user = store.users.find((u: any) => u.session_token === token)
    if (!user) return json({ success: false, error: 'Invalid session' }, sid, 401)
    const fields = ['firstName','lastName','phone','address','city','postalCode','canton','notes']
    fields.forEach(f => { if (data[f] !== undefined) user[f] = data[f] })
    saveStore(sid, store)
    return json({ success: true, message: 'User updated', user }, sid)
  }

  // add_blog_post.php
  if (endpoint === 'add_blog_post.php') {
    const { fields: fd, files } = await parseFormDataWithFiles(req)
    const heroUrl = files['hero_image'] ? await saveUploadedFile(files['hero_image'], sid) : null
    const img2 = files['image2'] ? await saveUploadedFile(files['image2'], sid) : null
    const img3 = files['image3'] ? await saveUploadedFile(files['image3'], sid) : null
    const img4 = files['image4'] ? await saveUploadedFile(files['image4'], sid) : null
    const post: any = { id: store.nextIds.blog++, title: fd.title || '', content: fd.content || '', excerpt: fd.excerpt || '', hero_image: heroUrl, hero_image_url: heroUrl, image2: img2, image2_url: img2, image3: img3, image3_url: img3, image4: img4, image4_url: img4, created_at: now, updated_at: now }
    store.blog_posts.push(post)
    saveStore(sid, store)
    return json({ success: true, message: 'Post añadido', id: post.id }, sid)
  }

  // edit_blog_post.php
  if (endpoint === 'edit_blog_post.php') {
    const { fields: fd, files } = await parseFormDataWithFiles(req)
    const id = parseInt(fd.id || '0')
    const idx = store.blog_posts.findIndex((p: any) => p.id === id)
    if (idx === -1) return json({ success: false, error: 'Post no encontrado' }, sid, 404)
    const p = store.blog_posts[idx]
    if (fd.title) p.title = fd.title
    if (fd.content) p.content = fd.content
    if (fd.excerpt !== undefined) p.excerpt = fd.excerpt
    for (const [key, label] of [['hero_image','hero_image'],['image2','image2'],['image3','image3'],['image4','image4']] as const) {
      if (files[key]) { const url = await saveUploadedFile(files[key], sid); (p as any)[key] = url; (p as any)[key + '_url'] = url }
    }
    p.updated_at = now
    saveStore(sid, store)
    return json({ success: true, message: 'Post actualizado' }, sid)
  }

  // add_gallery_image.php
  if (endpoint === 'add_gallery_image.php') {
    const { fields: fd, files } = await parseFormDataWithFiles(req)
    let imageUrl = fd.image_url || ''
    if (files['image']) imageUrl = await saveUploadedFile(files['image'], sid)
    const img = { id: store.nextIds.gallery++, image: imageUrl, image_url: imageUrl, title: fd.title || '', description: fd.description || '', created_at: now }
    store.gallery_images.push(img)
    saveStore(sid, store)
    return json({ success: true, message: 'Imagen añadida', id: img.id }, sid)
  }

  return json({ success: false, error: `Unknown endpoint: ${endpoint}` }, sid, 404)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const endpoint = resolvedParams.path.join('/')
  const sid = getSessionId(req)
  const store = getOrCreateStore(sid)
  const sp = req.nextUrl.searchParams

  // edit_product.php (DELETE)
  if (endpoint === 'edit_product.php') {
    let id = 0
    try {
      const body = await req.text()
      const p = new URLSearchParams(body)
      id = parseInt(p.get('id') || '0')
    } catch {}
    if (!id) id = parseInt(sp.get('id') || '0')
    store.products = store.products.filter((p: any) => p.id !== id)
    saveStore(sid, store)
    return json({ success: true, message: 'Producto eliminado' }, sid)
  }

  // delete_gallery_image.php
  if (endpoint === 'delete_gallery_image.php') {
    const id = parseInt(sp.get('id') || '0')
    store.gallery_images = store.gallery_images.filter((img: any) => img.id !== id)
    saveStore(sid, store)
    return json({ success: true, message: 'Imagen eliminada' }, sid)
  }

  // edit_blog_post.php (DELETE)
  if (endpoint === 'edit_blog_post.php') {
    const id = parseInt(sp.get('id') || '0')
    store.blog_posts = store.blog_posts.filter((p: any) => p.id !== id)
    saveStore(sid, store)
    return json({ success: true, message: 'Post eliminado' }, sid)
  }

  // save_announcement.php (DELETE)
  if (endpoint === 'save_announcement.php') {
    const id = parseInt(sp.get('id') || '0')
    store.announcements = store.announcements.filter((a: any) => a.id !== id)
    saveStore(sid, store)
    return json({ success: true, message: 'Anuncio eliminado' }, sid)
  }

  return json({ success: false, error: `Unknown endpoint: ${endpoint}` }, sid, 404)
}
