"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  RefreshCw,
  Filter,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  Clock,
  Flame,
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Shield,
  X,
  AlertTriangle,
  Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Interfaces für Orders
interface OrderItem {
  order_id: number
  product_id: number
  product_name: string
  product_description: string
  product_image: string
  price: number | string
  quantity: number
  subtotal: number | string
  heat_level: number
  rating: number | string
  badge: string
  origin: string
}

interface Order {
  id: number
  order_number: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_postal_code: string
  customer_canton: string
  customer_notes: string
  total_amount: number | string
  shipping_cost: number | string
  status: "pending" | "processing" | "completed" | "cancelled"
  payment_method: string
  payment_status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
  items_count: number
  items?: OrderItem[]
}

interface OrderStats {
  total_orders: number | string
  total_revenue: number | string
  avg_order_value: number | string
  completed_orders: number | string
  pending_orders: number | string
  processing_orders: number | string
  cancelled_orders: number | string
}

// Interfaces für Products
interface Product {
  id: number
  name: string
  description: string
  price: number | string
  category: string
  stock: number
  stock_status: "in_stock" | "low_stock" | "out_of_stock"
  heat_level: number
  rating: number | string
  badge: string
  origin: string
  image_url: string
  created_at: string
}

interface ProductStats {
  total_products: number
  hot_sauces: number
  bbq_sauces: number
  total_stock: number
  out_of_stock: number
  low_stock: number
  in_stock: number
}

interface Category {
  id: number
  slug: string
  name: string
  description: string
}

interface AdminProps {
  onClose: () => void
}

export default function AdminPage() {
  return <Admin onClose={() => window.history.back()} />
}

export function Admin({ onClose }: AdminProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("orders")

  // Orders State
  const [orders, setOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState("")
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const [totalOrderPages, setTotalOrderPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  // Products State
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productStats, setProductStats] = useState<ProductStats | null>(null)
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState("")
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null])
  const [removedImages, setRemovedImages] = useState<boolean[]>([false, false, false, false])

  // Categories State
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Filter Orders
  const [orderFilters, setOrderFilters] = useState({
    search: "",
    status: "all",
    email: "",
  })

  // Filter Products
  const [productFilters, setProductFilters] = useState({
    search: "",
    category: "",
    stock_status: "",
    sortBy: "name",
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders()
    } else if (activeTab === "products") {
      loadProducts()
      if (categories.length === 0) loadCategories()
    }
  }, [activeTab, currentOrderPage, orderFilters])

  useEffect(() => {
    if (activeTab === "products") {
      filterProducts()
    }
  }, [products, productFilters])

  // Orders Functions
  const loadOrders = async () => {
    try {
      setOrdersLoading(true)
      setOrdersError("")

      const params = new URLSearchParams({
        page: currentOrderPage.toString(),
        limit: "20",
        include_items: "true",
        ...Object.fromEntries(Object.entries(orderFilters).filter(([_, value]) => value && value !== "all")),
      })

      const response = await fetch(`${API_BASE_URL}/get_orders.php?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setOrderStats(data.stats)
        setTotalOrderPages(data.pagination.total_pages)
      } else {
        setOrdersError("Fehler beim Laden der Bestellungen")
      }
    } catch (err) {
      setOrdersError("Verbindungsfehler")
      console.error("Error loading orders:", err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleOrderFilterChange = (key: string, value: string) => {
    setOrderFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentOrderPage(1)
  }

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  // Products Functions
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      setProductsError("")

      const params = new URLSearchParams()
      if (productFilters.stock_status) {
        params.append("stock_status", productFilters.stock_status)
      }

      const response = await fetch(`${API_BASE_URL}/get_products.php?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
        setProductStats(data.stats)
      } else {
        setProductsError("Fehler beim Laden der Produkte")
      }
    } catch (err) {
      setProductsError("Verbindungsfehler")
      console.error("Error loading products:", err)
    } finally {
      setProductsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_categories.php`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const isEditing = editingCategory !== null
    if (isEditing) formData.append("id", editingCategory.id.toString())
    const url = isEditing ? `${API_BASE_URL}/edit_category.php` : `${API_BASE_URL}/add_category.php`
    try {
      const response = await fetch(url, { method: "POST", body: formData })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Erfolg", description: isEditing ? "Kategorie aktualisiert" : "Kategorie erstellt" })
        setIsCategoryModalOpen(false)
        setEditingCategory(null)
        loadCategories()
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error(data.error || "Fehler")
      }
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteCategory = async (cat: Category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete_category.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${cat.id}`,
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Erfolg", description: "Kategorie gelöscht" })
        loadCategories()
      } else {
        toast({ title: "Nicht möglich", description: data.error, variant: "destructive" })
      }
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" })
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (productFilters.search) {
      const searchTerm = productFilters.search.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.badge && product.badge.toLowerCase().includes(searchTerm)) ||
          (product.origin && product.origin.toLowerCase().includes(searchTerm)),
      )
    }

    if (productFilters.category) {
      filtered = filtered.filter((product) => product.category === productFilters.category)
    }

    if (productFilters.stock_status) {
      filtered = filtered.filter((product) => product.stock_status === productFilters.stock_status)
    }

    filtered.sort((a, b) => {
      switch (productFilters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return Number.parseFloat(a.price.toString()) - Number.parseFloat(b.price.toString())
        case "stock":
          return b.stock - a.stock
        case "rating":
          return Number.parseFloat(b.rating.toString()) - Number.parseFloat(a.rating.toString())
        case "heat_level":
          return b.heat_level - a.heat_level
        case "category":
          return a.category.localeCompare(b.category)
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const showAddProductModal = () => {
    setCurrentEditingProduct(null)
    setImagePreviews([null, null, null, null])
    setRemovedImages([false, false, false, false])
    setIsProductModalOpen(true)
  }

  const showEditProductModal = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_products.php?id=${id}`)
      const data = await response.json()

      if (data.success) {
        setCurrentEditingProduct(data.product)
        setImagePreviews(data.product.image_urls || [data.product.image_url, null, null, null])
        setRemovedImages([false, false, false, false])
        setIsProductModalOpen(true)
      } else {
        toast({
          title: "Fehler",
          description: "Fehler beim Laden des Produkts",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading product:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Laden des Produkts",
        variant: "destructive",
      })
    }
  }

  const showDeleteProductModal = (id: number, name: string) => {
    setDeleteProductId(id)
    setIsDeleteModalOpen(true)
  }

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const isEditing = currentEditingProduct !== null

    if (isEditing) {
      formData.append("id", currentEditingProduct.id.toString())
    }

    const form = e.currentTarget
    for (let i = 0; i < 4; i++) {
      const imageInput = form.elements.namedItem(`image_${i}`) as HTMLInputElement
      if (imageInput?.files?.[0]) {
        formData.append(`image_${i}`, imageInput.files[0])
      } else if (isEditing) {
        if (removedImages[i]) {
          formData.append(`remove_image_${i}`, 'true')
        } else if (imagePreviews[i]) {
          formData.append(`keep_image_${i}`, 'true')
        }
      }
    }

    try {
      const url = isEditing ? `${API_BASE_URL}/edit_product.php` : `${API_BASE_URL}/add_product.php`

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Erfolg",
          description: isEditing ? "Produkt erfolgreich aktualisiert" : "Produkt erfolgreich hinzugefügt",
        })
        setIsProductModalOpen(false)
        loadProducts()
      } else {
        throw new Error(data.error || "Fehler beim Speichern des Produkts")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern des Produkts",
        variant: "destructive",
      })
    }
  }

  const confirmDeleteProduct = async () => {
    if (!deleteProductId) return

    try {
      const response = await fetch(`${API_BASE_URL}/edit_product.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${deleteProductId}`,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Erfolg",
          description: "Produkt erfolgreich gelöscht",
        })
        setIsDeleteModalOpen(false)
        setDeleteProductId(null)
        loadProducts()
      } else {
        throw new Error(data.error || "Fehler beim Löschen des Produkts")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen des Produkts",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPreviews = [...imagePreviews]
        newPreviews[index] = e.target?.result as string
        setImagePreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  // Utility Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Abgeschlossen"
      case "pending":
        return "Ausstehend"
      case "processing":
        return "In Bearbeitung"
      case "cancelled":
        return "Storniert"
      default:
        return status
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800 border-green-200"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "out_of_stock":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStockStatusText = (status: string) => {
    switch (status) {
      case "in_stock":
        return "Auf Lager"
      case "low_stock":
        return "Geringer Lagerbestand"
      case "out_of_stock":
        return "Nicht vorrätig"
      default:
        return status
    }
  }

  const getCategoryDisplay = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug)
    return cat ? cat.name : slug || "❓ Keine Kategorie"
  }

  const generateHeatIcons = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Flame key={i} className={`w-4 h-4 ${i < level ? "text-red-500" : "text-gray-300"}`} />
    ))
  }

  const generateStarIcons = (rating: number | string) => {
    const numRating = Number.parseFloat(rating.toString())
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(numRating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (
    (activeTab === "orders" && ordersLoading && orders.length === 0) ||
    (activeTab === "products" && productsLoading && products.length === 0)
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Verwaltungspanel wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">GLUTWERK</h1>
                <p className="text-gray-600">Verwaltungspanel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={onClose} variant="outline" className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <Button
                onClick={activeTab === "orders" ? loadOrders : loadProducts}
                disabled={ordersLoading || productsLoading}
                className="bg-gray-500 hover:bg-orange-600 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${ordersLoading || productsLoading ? "animate-spin" : ""}`} />
                Aktualisieren
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200">
            <TabsTrigger
              value="orders"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bestellungen</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              <Package className="w-4 h-4" />
              <span>Produkte</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {/* Orders Stats Cards */}
            {orderStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Gesamtbestellungen</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {Number.parseInt(orderStats.total_orders ?? 0) || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Gesamtumsatz</p>
                        <p className="text-2xl font-bold text-green-600">
                          {(Number.parseFloat(orderStats.total_revenue ?? 0) || 0).toFixed(2)} CHF
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Abgeschlossen</p>
                        <p className="text-2xl font-bold text-green-600">
                          {Number.parseInt(orderStats.completed_orders ?? 0) || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Ausstehend</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {Number.parseInt(orderStats.pending_orders ?? 0) || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-orange-600" />
                  Bestellungsfilter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="order-search">Suchen</Label>
                    <Input
                      id="order-search"
                      placeholder="Name, E-Mail, Nummer..."
                      value={orderFilters.search}
                      onChange={(e) => handleOrderFilterChange("search", e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="order-status">Status</Label>
                    <Select
                      value={orderFilters.status}
                      onValueChange={(value) => handleOrderFilterChange("status", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Alle Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">Alle</SelectItem>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                        <SelectItem value="processing">In Bearbeitung</SelectItem>
                        <SelectItem value="completed">Abgeschlossen</SelectItem>
                        <SelectItem value="cancelled">Storniert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order-email">E-Mail</Label>
                    <Input
                      id="order-email"
                      type="email"
                      placeholder="kunde@email.com"
                      value={orderFilters.email}
                      onChange={(e) => handleOrderFilterChange("email", e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setOrderFilters({ search: "", status: "all", email: "" })
                      }}
                      className="bg-gray-500 hover:bg-orange-600 text-white"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="w-6 h-6 text-gray-600" />
                        <span>{order.order_number}</span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Kunde</p>
                        <p className="text-lg font-bold text-gray-800">
                          {order.customer_first_name} {order.customer_last_name}
                        </p>
                        <p className="text-gray-600 text-sm">E-Mail: {order.customer_email}</p>
                        <p className="text-gray-600 text-sm">Telefon: {order.customer_phone}</p>
                        <p className="text-gray-600 text-sm">Adresse: {order.customer_address}</p>
                        <p className="text-gray-600 text-sm">Stadt: {order.customer_city}</p>
                        <p className="text-gray-600 text-sm">Kanton: {order.customer_canton}</p>
                        {order.customer_notes && <p className="text-gray-600 text-sm">Notizen: {order.customer_notes}</p>}
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Gesamt</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {(Number.parseFloat(order.total_amount.toString()) || 0).toFixed(2)} CHF
                        </p>
                        <p className="text-gray-600 text-sm">Versandkosten</p>
                        <p className="text-lg font-bold text-gray-800">
                          {(Number.parseFloat(order.shipping_cost.toString()) || 0).toFixed(2)} CHF
                        </p>
                        <p className="text-gray-600 text-sm">Erstellungsdatum</p>
                        <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
                        <p className="text-gray-600 text-sm">Aktualisierungsdatum</p>
                        <p className="text-gray-600 text-sm">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => showOrderDetail(order)}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Details anzeigen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Pagination */}
            <div className="flex items-center justify-center mt-8">
              <Button
                onClick={() => setCurrentOrderPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentOrderPage === 1}
                className="bg-orange-500 hover:bg-orange-600 text-white mr-2"
              >
                Zurück
              </Button>
              <span className="text-gray-600">
                Seite {currentOrderPage} von {totalOrderPages}
              </span>
              <Button
                onClick={() => setCurrentOrderPage((prev) => Math.min(prev + 1, totalOrderPages))}
                disabled={currentOrderPage === totalOrderPages}
                className="bg-orange-500 hover:bg-orange-600 text-white ml-2"
              >
                Weiter
              </Button>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            {/* Products Stats Cards */}
            {productStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Gesamtprodukte</p>
                        <p className="text-2xl font-bold text-gray-800">{productStats.total_products}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Gesamtlagerbestand</p>
                        <p className="text-2xl font-bold text-green-600">{productStats.total_stock}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package2 className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Geringer Lagerbestand</p>
                        <p className="text-2xl font-bold text-yellow-600">{productStats.low_stock}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Nicht vorrätig</p>
                        <p className="text-2xl font-bold text-red-600">{productStats.out_of_stock}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Produktverwaltung</h2>
              <div className="flex items-center space-x-2">
                <Button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true) }} variant="outline" className="border-orange-400 text-orange-600 bg-white hover:bg-orange-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Kategorie erstellen
                </Button>
                <Button onClick={showAddProductModal} className="bg-white hover:bg-orange-50 text-orange-600 border border-orange-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Produkt hinzufügen
                </Button>
              </div>
            </div>

            {/* Categories List */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Vorhandene Kategorien</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const productCount = products.filter((p) => p.category === cat.slug).length
                    return (
                      <div key={cat.slug} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
                          <p className="text-xs text-gray-400">{productCount} Produkt{productCount !== 1 ? "e" : ""}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true) }}
                            className="text-blue-500 hover:text-blue-700 bg-white hover:bg-blue-50 p-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(cat)}
                            disabled={productCount > 0}
                            title={productCount > 0 ? `${productCount} Produkte – zuerst löschen` : "Löschen"}
                            className="text-red-300 bg-white p-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Products Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-orange-600" />
                  Produktfilter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="product-search">Suchen</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="product-search"
                        placeholder="Produkte suchen..."
                        value={productFilters.search}
                        onChange={(e) => setProductFilters((prev) => ({ ...prev, search: e.target.value }))}
                        className="bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product-category">Kategorie</Label>
                    <Select
                      value={productFilters.category || "all"}
                      onValueChange={(value) => setProductFilters((prev) => ({ ...prev, category: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Alle Kategorien" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">Alle Kategorien</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="product-stock-status">Lagerstatus</Label>
                    <Select
                      value={productFilters.stock_status || "all"}
                      onValueChange={(value) => setProductFilters((prev) => ({ ...prev, stock_status: value === "all" ? "" : value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Alle Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="in_stock">Auf Lager</SelectItem>
                        <SelectItem value="low_stock">Geringer Lagerbestand</SelectItem>
                        <SelectItem value="out_of_stock">Nicht vorrätig</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="product-sort">Sortieren nach</Label>
                    <Select
                      value={productFilters.sortBy}
                      onValueChange={(value) => setProductFilters((prev) => ({ ...prev, sortBy: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Preis</SelectItem>
                        <SelectItem value="stock">Lagerbestand</SelectItem>
                        <SelectItem value="rating">Bewertung</SelectItem>
                        <SelectItem value="heat_level">Schärfegrad</SelectItem>
                        <SelectItem value="category">Kategorie</SelectItem>
                        <SelectItem value="created_at">Datum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setProductFilters({ search: "", category: "", stock_status: "", sortBy: "name" })
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={product.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => showEditProductModal(product.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => showDeleteProductModal(product.id, product.name)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">{getCategoryDisplay(product.category)}</Badge>
                        <span className="font-bold text-lg text-gray-800">
                          {Number.parseFloat(product.price.toString()).toFixed(2)} CHF
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStockStatusColor(product.stock_status)}>
                            {getStockStatusText(product.stock_status)}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700">
                            Lager: {product.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Schärfe:</span>
                          <div className="flex space-x-1">{generateHeatIcons(product.heat_level)}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">{generateStarIcons(product.rating)}</div>
                          <span className="text-sm text-gray-600">
                            {Number.parseFloat(product.rating.toString()).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {product.badge && (
                        <Badge variant="outline" className="text-xs">
                          {product.badge}
                        </Badge>
                      )}

                      {product.origin && <p className="text-xs text-gray-500">Herkunft: {product.origin}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Keine Produkte gefunden</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-6 h-6 text-gray-600" />
                    <span>{selectedOrder.order_number}</span>
                  </div>
                  <Badge className={getStatusColor(selectedOrder.status)}>{getStatusText(selectedOrder.status)}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Kundeninformationen</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.customer_first_name}{" "}
                      {selectedOrder.customer_last_name}
                    </p>
                    <p>
                      <span className="font-medium">E-Mail:</span> {selectedOrder.customer_email}
                    </p>
                    <p>
                      <span className="font-medium">Telefon:</span> {selectedOrder.customer_phone}
                    </p>
                    <p>
                      <span className="font-medium">Adresse:</span> {selectedOrder.customer_address}
                    </p>
                    <p>
                      <span className="font-medium">Stadt:</span> {selectedOrder.customer_city}
                    </p>
                    <p>
                      <span className="font-medium">Postleitzahl:</span> {selectedOrder.customer_postal_code}
                    </p>
                    <p>
                      <span className="font-medium">Kanton:</span> {selectedOrder.customer_canton}
                    </p>
                    {selectedOrder.customer_notes && (
                      <p>
                        <span className="font-medium">Notizen:</span> {selectedOrder.customer_notes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Bestellinformationen</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Gesamt:</span>{" "}
                      {(Number.parseFloat(selectedOrder.total_amount.toString()) || 0).toFixed(2)} CHF
                    </p>
                    <p>
                      <span className="font-medium">Versandkosten:</span>{" "}
                      {(Number.parseFloat(selectedOrder.shipping_cost.toString()) || 0).toFixed(2)} CHF
                    </p>
                    <p>
                      <span className="font-medium">Zahlungsmethode:</span> {selectedOrder.payment_method}
                    </p>
                    <p>
                      <span className="font-medium">Zahlungsstatus:</span> {selectedOrder.payment_status}
                    </p>
                    <p>
                      <span className="font-medium">Erstellungsdatum:</span> {formatDate(selectedOrder.created_at)}
                    </p>
                    <p>
                      <span className="font-medium">Letzte Aktualisierung:</span> {formatDate(selectedOrder.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-3">Bestellpositionen</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <Card key={item.product_id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.product_image || "/placeholder.svg?height=60&width=60"}
                              alt={item.product_name}
                              className="w-15 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product_name}</h4>
                              <p className="text-sm text-gray-600">{item.product_description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm">Menge: {item.quantity}</span>
                                <span className="text-sm">
                                  Preis: {Number.parseFloat(item.price.toString()).toFixed(2)} CHF
                                </span>
                                <span className="text-sm font-medium">
                                  Zwischensumme: {Number.parseFloat(item.subtotal.toString()).toFixed(2)} CHF
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Schärfe:</span>
                                  <div className="flex space-x-1">{generateHeatIcons(item.heat_level)}</div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="flex space-x-1">{generateStarIcons(item.rating)}</div>
                                  <span className="text-xs text-gray-500">
                                    {Number.parseFloat(item.rating.toString()).toFixed(1)}
                                  </span>
                                </div>
                                {item.badge && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.origin && <span className="text-xs text-gray-500">Herkunft: {item.origin}</span>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Product Add/Edit Modal */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>{currentEditingProduct ? "Produkt bearbeiten" : "Produkt hinzufügen"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleProductSubmit} className="space-y-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Produktname *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={currentEditingProduct?.name || ""}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preis (CHF) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={currentEditingProduct?.price || ""}
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={currentEditingProduct?.description || ""}
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select name="category" defaultValue={currentEditingProduct?.category || ""} required>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stock">Lagerbestand *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue={currentEditingProduct?.stock || "0"}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heat_level">Unterkategorie</Label>
                  <Select name="heat_level" defaultValue={currentEditingProduct?.heat_level?.toString() || "1"}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1">1 - Leder</SelectItem>
                      <SelectItem value="2">2 - kunststoff</SelectItem>
          
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rating">Bewertung (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={currentEditingProduct?.rating || ""}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    name="badge"
                    placeholder="z.B. Neue, Aktion"
                    defaultValue={currentEditingProduct?.badge || ""}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Herkunft</Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="z.B. USA, Europa"
                    defaultValue={currentEditingProduct?.origin || ""}
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <Label>Produktbilder</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`image_${index}`}>Bild {index + 1}</Label>
                      <Input
                        id={`image_${index}`}
                        name={`image_${index}`}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange(index)}
                        className="bg-white"
                      />
                      {imagePreviews[index] && (
                        <div className="relative">
                          <img
                            src={imagePreviews[index] || "/placeholder.svg"}
                            alt={`Vorschau ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const newPreviews = [...imagePreviews]
                              newPreviews[index] = null
                              setImagePreviews(newPreviews)
                              if (currentEditingProduct) {
                                const newRemoved = [...removedImages]
                                newRemoved[index] = true
                                setRemovedImages(newRemoved)
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} className="bg-white text-gray-700 hover:bg-gray-50">
                  Abbrechen
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  {currentEditingProduct ? "Aktualisieren" : "Erstellen"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Category Create/Edit Modal */}
        <Dialog open={isCategoryModalOpen} onOpenChange={(open) => { setIsCategoryModalOpen(open); if (!open) setEditingCategory(null) }}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Kategorie bearbeiten" : "Neue Kategorie erstellen"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="cat-name">Name *</Label>
                <Input
                  id="cat-name"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ""}
                  key={editingCategory?.id ?? "new"}
                  placeholder="z.B. Rubs & Gewürze"
                  className="bg-white"
                />
                {!editingCategory && (
                  <p className="text-xs text-gray-400 mt-1">Der Slug wird automatisch generiert</p>
                )}
                {editingCategory && (
                  <p className="text-xs text-gray-400 mt-1">Slug: <span className="font-mono">{editingCategory.slug}</span> (wird nicht geändert)</p>
                )}
              </div>
              <div>
                <Label htmlFor="cat-description">Beschreibung</Label>
                <Textarea
                  id="cat-description"
                  name="description"
                  rows={2}
                  defaultValue={editingCategory?.description || ""}
                  key={(editingCategory?.id ?? "new") + "-desc"}
                  placeholder="Kurze Beschreibung der Kategorie..."
                  className="bg-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null) }} className="bg-white text-gray-700 hover:bg-gray-50">
                  Abbrechen
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  {editingCategory ? "Speichern" : "Erstellen"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Product Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Löschen bestätigen</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-600">
                Sind Sie sicher, dass Sie dieses Produkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="bg-white text-gray-700 hover:bg-gray-50">
                Abbrechen
              </Button>
              <Button onClick={confirmDeleteProduct} className="bg-red-500 hover:bg-red-600 text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
