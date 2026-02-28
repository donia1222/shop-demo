import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'demo-data')
const IMG_BASE = 'https://web.lweb.ch/templettedhop/upload/'

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

export function createSessionId(): string {
  return crypto.randomBytes(16).toString('hex')
}

function buildImageUrls(filename: string | null) {
  if (!filename) return { image_url: null, image_url_candidates: [] }
  if (filename.startsWith('http')) return { image_url: filename, image_url_candidates: [filename] }
  const url = IMG_BASE + filename
  const base = url.replace(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i, '')
  const haExt = /\.(jpg|jpeg|png|webp)$/i.test(url)
  return {
    image_url: url,
    image_url_candidates: haExt ? [url] : [base+'.jpg', base+'.JPG', base+'.jpeg', base+'.png', base+'.webp'],
  }
}

function enrichProduct(p: any) {
  const imgs = buildImageUrls(p.image)
  return {
    ...p,
    image_url: p.image_url || imgs.image_url,
    image_url_candidates: p.image_url_candidates?.length ? p.image_url_candidates : imgs.image_url_candidates,
    stock_status: p.stock === 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock',
    weight_kg: p.weight_kg || 0.5,
  }
}

function createSeedData() {
  const now = new Date().toISOString()
  const products = [
    { id:2, name:"Big Red's - Heat Wave", description:'Eine Hitzewelle aus roten Chilis für wahre Schärfe-Liebhaber', price:12.84, image:'https://sphinxdateranch.com/cdn/shop/files/big-reds-3-kings-hot-sauce_aebc4b66-040a-48ce-9caf-d02ae71ae9f5.jpg?v=1717779634&width=1920', heat_level:5, rating:4.90, badge:'Hitzewelle', origin:'USA', category:'hot-sauce', stock:6, weight_kg:0.5, created_at:now, updated_at:now },
    { id:3, name:"Big Red's - Green Chili", description:'Frische grüne Chilis mit authentischem mexikanischem Geschmack', price:11.24, image:'https://bigredshotsauce.com/wp-content/uploads/2022/12/R-IND-GREENCHILI-698x1024.png', heat_level:3, rating:5.00, badge:'Frisch', origin:'USA', category:'hot-sauce', stock:12, weight_kg:0.5, created_at:now, updated_at:now },
    { id:4, name:"Big Red's - Original Sauce", description:'Die legendäre Originalrezept seit Generationen unverändert', price:1.10, image:'https://sphinxdateranch.com/cdn/shop/files/big-reds-original-hot-sauce.jpg?v=1723097303&width=1946', heat_level:4, rating:4.60, badge:'Klassiker', origin:'USA', category:'hot-sauce', stock:6, weight_kg:0.5, created_at:now, updated_at:now },
    { id:5, name:"Big Red's - Habanero", description:'Authentische Habanero-Chilis für den ultimativen Schärfe-Genuss', price:14.93, image:'https://sphinxdateranch.com/cdn/shop/files/big-reds-smokey-habanero-hot-sauce_8b61ca7f-3219-42b1-95e5-a6e9a42c7a48.jpg?v=1725315959&width=1946', heat_level:3, rating:4.80, badge:'Habanero', origin:'USA', category:'hot-sauce', stock:8, weight_kg:0.5, created_at:now, updated_at:now },
    { id:11, name:'Honey BBQ', description:'Eine perfekte Mischung aus natürlichem Honig und rauchigen Gewürzen, die jeden Grillabend veredelt', price:14.00, image:'https://stockpotkitchen.com.au/wp-content/uploads/2021/09/OG-BBQ-sauce-front.jpg', heat_level:3, rating:4.90, badge:'Süß', origin:'USA', category:'bbq-sauce', stock:12, weight_kg:0.5, created_at:now, updated_at:now },
    { id:12, name:'Garlic BBQ', description:'Für Knoblauch-Liebhaber - eine Geschmacksexplosion, die Ihr Fleisch transformiert', price:14.00, image:'https://bigredshotsauce.com/wp-content/uploads/2025/07/ALL-SAUCES-13-1024x1024.png', heat_level:1, rating:4.90, badge:'Intensiv', origin:'USA', category:'bbq-sauce', stock:4, weight_kg:0.5, created_at:now, updated_at:now },
  ].map(enrichProduct)

  const categories = [
    { id:1, slug:'hot-sauce', name:'🌶️ Hot Sauce', description:'Scharfe Saucen aus frischen Chilis', created_at:now },
    { id:2, slug:'bbq-sauce', name:'🔥 BBQ Sauce', description:'Rauchige Grillsaucen für perfektes BBQ', created_at:now },
  ]

  const orders = [
    { id:1, user_id:null, order_number:'ORDER_DEMO_001', customer_first_name:'Max', customer_last_name:'Mustermann', customer_email:'max@example.com', customer_phone:'+41 79 123 45 67', customer_address:'Bahnhofstrasse 1', customer_city:'Zürich', customer_postal_code:'8001', customer_canton:'ZH', customer_notes:'Demo-Bestellung', total_amount:28.90, shipping_cost:6.50, status:'completed', payment_method:'invoice', payment_status:'completed', created_at:now, updated_at:now, items:[{id:1,product_id:1,product_name:"Big Red's - Big Yella",quantity:2,unit_price:14.90,price:14.90,subtotal:29.80}] },
    { id:2, user_id:null, order_number:'ORDER_DEMO_002', customer_first_name:'Anna', customer_last_name:'Schmidt', customer_email:'anna@example.com', customer_phone:'+41 44 987 65 43', customer_address:'Hauptstrasse 42', customer_city:'Bern', customer_postal_code:'3011', customer_canton:'BE', customer_notes:'', total_amount:14.00, shipping_cost:6.50, status:'pending', payment_method:'invoice', payment_status:'pending', created_at:now, updated_at:now, items:[{id:2,product_id:11,product_name:'Honey BBQ',quantity:1,unit_price:14.00,price:14.00,subtotal:14.00}] },
  ]

  return {
    products,
    categories,
    orders,
    blog_posts: [],
    gallery_images: [],
    announcements: [],
    payment_settings: {
      enable_invoice: true, enable_paypal: false, enable_stripe: false, enable_twint: false,
      paypal_email: '', stripe_publishable_key: '', stripe_secret_key: '', stripe_pmc_id: '',
      twint_phone: '', bank_iban: 'CH56 0483 5012 3456 7800 9', bank_holder: 'Demo Store GmbH', bank_name: 'Demo Bank',
    },
    shipping: {
      zones: [
        { id:1, name:'Schweiz', countries:'CH', enabled:true },
        { id:2, name:'Europa', countries:'DE,FR,IT,AT,ES,NL,BE,PL,PT,CZ,DK,SE,FI,NO,HU,RO,HR,SK,SI,LU,LI', enabled:true },
        { id:3, name:'International', countries:'*', enabled:true },
      ],
      ranges: [
        { id:1, min_kg:0, max_kg:0.5, label:'0–0.5 kg' },
        { id:2, min_kg:0.5, max_kg:1, label:'0.5–1 kg' },
        { id:3, min_kg:1, max_kg:3, label:'1–3 kg' },
        { id:4, min_kg:3, max_kg:5, label:'3–5 kg' },
        { id:5, min_kg:5, max_kg:10, label:'5–10 kg' },
        { id:6, min_kg:10, max_kg:9999, label:'10+ kg' },
      ],
      rates: [
        {zone_id:1,range_id:1,price:6.50},{zone_id:1,range_id:2,price:8.00},{zone_id:1,range_id:3,price:10.00},{zone_id:1,range_id:4,price:14.00},{zone_id:1,range_id:5,price:20.00},{zone_id:1,range_id:6,price:30.00},
        {zone_id:2,range_id:1,price:12.00},{zone_id:2,range_id:2,price:16.00},{zone_id:2,range_id:3,price:22.00},{zone_id:2,range_id:4,price:30.00},{zone_id:2,range_id:5,price:45.00},{zone_id:2,range_id:6,price:65.00},
        {zone_id:3,range_id:1,price:18.00},{zone_id:3,range_id:2,price:24.00},{zone_id:3,range_id:3,price:35.00},{zone_id:3,range_id:4,price:50.00},{zone_id:3,range_id:5,price:75.00},{zone_id:3,range_id:6,price:110.00},
      ],
    },
    users: [],
    nextIds: { product:100, category:10, order:3, blog:1, gallery:1, announcement:1, user:1 },
  }
}

export type Store = ReturnType<typeof createSeedData>

export function getStore(sessionId: string): Store {
  ensureDataDir()
  const file = path.join(DATA_DIR, `${sessionId}.json`)
  if (!fs.existsSync(file)) return createSeedData()
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as Store
  } catch {
    return createSeedData()
  }
}

export function saveStore(sessionId: string, store: Store): void {
  ensureDataDir()
  const file = path.join(DATA_DIR, `${sessionId}.json`)
  fs.writeFileSync(file, JSON.stringify(store, null, 2))
}

export function getOrCreateStore(sessionId: string): Store {
  ensureDataDir()
  const file = path.join(DATA_DIR, `${sessionId}.json`)
  if (!fs.existsSync(file)) {
    const seed = createSeedData()
    fs.writeFileSync(file, JSON.stringify(seed, null, 2))
    return seed
  }
  return getStore(sessionId)
}
