"use client"

import { useState, useEffect } from "react"
import { User, Eye, EyeOff, Mail, KeyRound, CheckCircle, AlertCircle, LogOut, UserPlus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface UserData {
  id?: number
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postalCode: string
  canton: string
  notes: string
}

interface LoginAuthProps {
  onLoginSuccess?: (user: UserData) => void
  onLogout?: () => void
  onShowProfile?: () => void
  className?: string
  variant?: "button" | "inline"
  buttonText?: string
  isLightSection?: boolean
}

// Exportable Admin Login Button Component
export function AdminLoginButton({
  className = "",
  isLightSection = false,
  onOpenAuth,
}: {
  className?: string
  isLightSection?: boolean
  onOpenAuth: () => void
}) {
  return (
    <Button
      onClick={onOpenAuth}
      variant="ghost"
      size="sm"
      className={`p-2 rounded-xl transition-all duration-300 ${
        isLightSection
          ? "text-gray-900/10 hover:bg-white/20 text-white border-white/20"
          : "text-gray-900/5 hover:bg-white/10 text-gray-600 hover:text-gray-800"
      } ${className}`}
    >
      <User className="w-6 h-6 text-gray-200" />
    </Button>
  )
}

export function LoginAuth({
  onLoginSuccess,
  onLogout,
  onShowProfile,
  className = "",
  variant = "button",
  buttonText = "Anmelden",
  isLightSection = false,
}: LoginAuthProps) {
  // User states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  // Login states
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginErrors, setLoginErrors] = useState<any>({})
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">("idle")
  const [loginMessage, setLoginMessage] = useState("")

  // Register states
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerErrors, setRegisterErrors] = useState<any>({})
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerStatus, setRegisterStatus] = useState<"idle" | "success" | "error">("idle")
  const [registerMessage, setRegisterMessage] = useState("")

  // Password Reset states
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle")
  const [resetMessage, setResetMessage] = useState("")
  const [resetErrors, setResetErrors] = useState<any>({})

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  // Check if user is logged in on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔍 LoginAuth: Inicializando autenticación...")
      const sessionToken = localStorage.getItem("user-session-token")
      if (sessionToken) {
        console.log("🎫 Token encontrado:", sessionToken.substring(0, 20) + "...")
        const isValid = await verifyAndLoadUser(sessionToken)
        if (!isValid) {
          console.log("❌ Token inválido, limpiando...")
          localStorage.removeItem("user-session-token")
        }
      }
    }
    initializeAuth()
  }, [])

  const verifyAndLoadUser = async (sessionToken: string): Promise<boolean> => {
    try {
      console.log("🔄 Verificando token con el servidor...")
      const response = await fetch(`${API_BASE_URL}/get_user.php`, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          sessionToken: sessionToken,
        }),
      })

      console.log("📡 Respuesta del servidor:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error HTTP:", response.status, errorText)
        return false
      }

      const data = await response.json()
      console.log("✅ Datos del usuario recibidos:", data)

      if (data.success && data.user) {
        const userData = {
          id: data.user.user_id || data.user.id,
          email: data.user.email,
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          postalCode: data.user.postal_code || "",
          canton: data.user.canton || "",
          notes: data.user.notes || "",
        }

        setIsLoggedIn(true)
        setCurrentUser(userData)

        // Notify parent component
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }

        console.log("✅ Usuario logueado exitosamente")
        return true
      } else {
        console.error("❌ Respuesta inválida del servidor:", data)
        return false
      }
    } catch (error) {
      console.error("❌ Error verificando token:", error)
      return false
    }
  }

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserMenu(true)
    } else {
      setShowAuthModal(true)
      setAuthMode("login")
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true)
      setLoginStatus("idle")
      setLoginErrors({})
      console.log("🔄 Iniciando sesión...")

      // Basic validation
      const errors: any = {}
      if (!loginData.email.trim()) errors.email = "E-Mail ist erforderlich"
      if (!loginData.password.trim()) errors.password = "Passwort ist erforderlich"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (loginData.email && !emailRegex.test(loginData.email)) {
        errors.email = "Ungültige E-Mail-Adresse"
      }

      if (Object.keys(errors).length > 0) {
        setLoginErrors(errors)
        return
      }

      const response = await fetch(`${API_BASE_URL}/login_user.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      console.log("📡 Respuesta de login:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error HTTP:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Respuesta de login:", result)

      if (result.success && result.sessionToken) {
        const sessionToken = result.sessionToken
        console.log("💾 Guardando token de login:", sessionToken.substring(0, 20) + "...")
        localStorage.setItem("user-session-token", sessionToken)

        const userData = {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          phone: result.user.phone || "",
          address: result.user.address || "",
          city: result.user.city || "",
          postalCode: result.user.postal_code || "",
          canton: result.user.canton || "",
          notes: result.user.notes || "",
        }

        setIsLoggedIn(true)
        setCurrentUser(userData)
        setLoginStatus("success")
        setLoginMessage("¡Anmeldung erfolgreich!")

        // Clear login data
        setLoginData({
          email: "",
          password: "",
        })

        // Notify parent component
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }

        // Close modal after success
        setTimeout(() => {
          setShowAuthModal(false)
          setLoginStatus("idle")
        }, 1500)

        console.log("✅ Login exitoso")
      } else {
        throw new Error(result.error || "Login failed")
      }
    } catch (error: unknown) {
      console.error("❌ Error en login:", error)
      setLoginStatus("error")
      let errorMessage = "Error desconocido"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      // More specific messages
      if (errorMessage.includes("Invalid email or password")) {
        errorMessage = "E-Mail oder Passwort ist falsch"
      } else if (errorMessage.includes("Load failed") || errorMessage.includes("Failed to fetch")) {
        errorMessage = "Verbindungsfehler. Bitte versuchen Sie es erneut."
      }

      setLoginMessage(errorMessage)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async () => {
    try {
      setIsRegistering(true)
      setRegisterStatus("idle")
      setRegisterErrors({})
      console.log("🔄 Registrando usuario...")

      // Basic validation
      const errors: any = {}
      if (!registerData.firstName.trim()) errors.firstName = "Vorname ist erforderlich"
      if (!registerData.lastName.trim()) errors.lastName = "Nachname ist erforderlich"
      if (!registerData.email.trim()) errors.email = "E-Mail ist erforderlich"
      if (!registerData.password.trim()) errors.password = "Passwort ist erforderlich"
      if (registerData.password.length < 6) errors.password = "Passwort muss mindestens 6 Zeichen haben"
      if (registerData.password !== registerData.confirmPassword) {
        errors.confirmPassword = "Passwörter stimmen nicht überein"
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (registerData.email && !emailRegex.test(registerData.email)) {
        errors.email = "Ungültige E-Mail-Adresse"
      }

      if (Object.keys(errors).length > 0) {
        setRegisterErrors(errors)
        return
      }

      const response = await fetch(`${API_BASE_URL}/create_user.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
        }),
      })

      console.log("📡 Respuesta de registro:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error HTTP:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Respuesta de registro:", result)

      if (result.success && result.sessionToken) {
        const sessionToken = result.sessionToken
        console.log("💾 Guardando token de registro:", sessionToken.substring(0, 20) + "...")
        localStorage.setItem("user-session-token", sessionToken)

        const userData = {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          phone: result.user.phone || "",
          address: result.user.address || "",
          city: result.user.city || "",
          postalCode: result.user.postalCode || "",
          canton: result.user.canton || "",
          notes: result.user.notes || "",
        }

        setIsLoggedIn(true)
        setCurrentUser(userData)
        setRegisterStatus("success")
        setRegisterMessage("¡Konto erfolgreich erstellt!")

        // Clear register data
        setRegisterData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        })

        // Notify parent component
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }

        // Close modal after success
        setTimeout(() => {
          setShowAuthModal(false)
          setRegisterStatus("idle")
        }, 1500)

        console.log("✅ Registro exitoso")
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error: unknown) {
      console.error("❌ Error en registro:", error)
      setRegisterStatus("error")
      let errorMessage = "Error desconocido"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      if (errorMessage.includes("Load failed") || errorMessage.includes("Failed to fetch")) {
        errorMessage = "Verbindungsfehler. Bitte versuchen Sie es erneut."
      } else if (errorMessage.includes("Email already exists")) {
        errorMessage = "Diese E-Mail-Adresse ist bereits registriert"
      }

      setRegisterMessage(errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleLogout = () => {
    console.log("🚪 Cerrando sesión...")
    localStorage.removeItem("user-session-token")
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowUserMenu(false)

    // Notify parent component
    if (onLogout) {
      onLogout()
    }
  }

  const handleShowProfile = () => {
    setShowUserMenu(false)
    if (onShowProfile) {
      onShowProfile()
    }
  }

  const handlePasswordReset = async () => {
    try {
      setIsResettingPassword(true)
      setResetStatus("idle")
      setResetErrors({})
      console.log("🔄 Iniciando reset de contraseña...")

      // Basic validation
      const errors: any = {}
      if (!resetEmail.trim()) {
        errors.email = "E-Mail-Adresse ist erforderlich"
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (resetEmail && !emailRegex.test(resetEmail)) {
        errors.email = "Ungültige E-Mail-Adresse"
      }

      if (Object.keys(errors).length > 0) {
        setResetErrors(errors)
        return
      }

      const response = await fetch(`${API_BASE_URL}/reset_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
        }),
      })

      console.log("📡 Respuesta de reset:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error HTTP:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Respuesta de reset:", result)

      if (result.success) {
        setResetStatus("success")
        setResetMessage(result.message || "Ein neues Passwort wurde an Ihre E-Mail-Adresse gesendet.")
        setResetEmail("")
        console.log("✅ Reset de contraseña exitoso")
      } else {
        throw new Error(result.error || "Password reset failed")
      }
    } catch (error: unknown) {
      console.error("❌ Error en reset de contraseña:", error)
      setResetStatus("error")
      let errorMessage = "Error desconocido"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      if (errorMessage.includes("Load failed") || errorMessage.includes("Failed to fetch")) {
        errorMessage = "Verbindungsfehler. Bitte versuchen Sie es erneut."
      } else if (errorMessage.includes("CORS")) {
        errorMessage = "Serverfehler. Bitte kontaktieren Sie den Support."
      }

      setResetMessage(errorMessage)
    } finally {
      setIsResettingPassword(false)
    }
  }

  const openPasswordReset = () => {
    setShowPasswordReset(true)
    setResetEmail(loginData.email)
    setResetStatus("idle")
    setResetMessage("")
    setResetErrors({})
  }

  const closePasswordReset = () => {
    setShowPasswordReset(false)
    setResetEmail("")
    setResetStatus("idle")
    setResetMessage("")
    setResetErrors({})
  }

  return (
    <>
      {/* User Icon Button */}
      <button
        onClick={handleUserIconClick}
        className={`relative flex flex-col items-center p-2 hover:bg-[#F5F5F5] rounded min-w-[64px] ${className}`}
      >
        <User className={`w-6 h-6 ${isLoggedIn ? "text-[#2C5F2E]" : "text-[#555]"}`} />
        <span className="text-xs text-[#555] mt-0.5 leading-none text-center font-medium">
          {isLoggedIn && currentUser ? currentUser.firstName || "Konto" : "Anmelden"}
        </span>
        {isLoggedIn && currentUser && (
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
        )}
      </button>

      {/* Auth Modal (Login/Register) */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              {authMode === "login" ? "Anmelden" : "Registrieren"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {authMode === "login" ? "Melden Sie sich mit Ihrem Konto an" : "Erstellen Sie ein neues Konto"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Mode Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  authMode === "login" ? "bg-white text-gray-900 text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Anmelden
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  authMode === "register" ? "bg-white text-gray-900 text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Registrieren
              </button>
            </div>

            {/* Login Form */}
            {authMode === "login" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">E-Mail *</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`bg-white text-gray-900 ${loginErrors.email ? "border-red-500" : ""}`}
                    placeholder="ihre@email.com"
                  />
                  {loginErrors.email && <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginPassword">Passwort *</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={openPasswordReset}
                      className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                    >
                      Passwort vergessen?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      className={`bg-white text-gray-900 pr-10 ${loginErrors.password ? "border-red-500" : ""}`}
                      placeholder="Ihr Passwort"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn || !loginData.email || !loginData.password}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Anmeldung läuft...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Anmelden
                    </>
                  )}
                </Button>

                {/* Login Status Messages */}
                {loginStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-green-700 font-medium">Erfolgreich angemeldet!</p>
                        <p className="text-green-600 text-sm mt-1">{loginMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {loginStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-red-700 font-medium">Anmeldung fehlgeschlagen</p>
                        <p className="text-red-600 text-sm mt-1">{loginMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Register Form */}
            {authMode === "register" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className={`bg-white text-gray-900 ${registerErrors.firstName ? "border-red-500" : ""}`}
                      placeholder="Max"
                    />
                    {registerErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{registerErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className={`bg-white text-gray-900 ${registerErrors.lastName ? "border-red-500" : ""}`}
                      placeholder="Mustermann"
                    />
                    {registerErrors.lastName && <p className="text-red-500 text-sm mt-1">{registerErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="registerEmail">E-Mail *</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`bg-white text-gray-900 ${registerErrors.email ? "border-red-500" : ""}`}
                    placeholder="ihre@email.com"
                  />
                  {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="registerPassword">Passwort *</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      className={`bg-white text-gray-900 pr-10 ${registerErrors.password ? "border-red-500" : ""}`}
                      placeholder="Mindestens 6 Zeichen"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {registerErrors.password && <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`bg-white text-gray-900 pr-10 ${registerErrors.confirmPassword ? "border-red-500" : ""}`}
                      placeholder="Passwort wiederholen"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={
                    isRegistering ||
                    !registerData.email ||
                    !registerData.password ||
                    !registerData.firstName ||
                    !registerData.lastName
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Konto wird erstellt...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Konto erstellen
                    </>
                  )}
                </Button>

                {/* Register Status Messages */}
                {registerStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-green-700 font-medium">Konto erfolgreich erstellt!</p>
                        <p className="text-green-600 text-sm mt-1">{registerMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {registerStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-red-700 font-medium">Registrierung fehlgeschlagen</p>
                        <p className="text-red-600 text-sm mt-1">{registerMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* User Menu Modal */}
      <Dialog open={showUserMenu} onOpenChange={setShowUserMenu}>
        <DialogContent className="sm:max-w-sm bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Mein Konto
            </DialogTitle>
            <DialogDescription className="text-center">
              Angemeldet als{" "}
              <strong>
                {currentUser?.firstName} {currentUser?.lastName}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Button
              onClick={handleShowProfile}
              variant="outline"
              className="w-full justify-start h-12 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              <Settings className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Profil anzeigen</div>
                <div className="text-xs text-blue-600">Daten bearbeiten</div>
              </div>
            </Button>

            <Separator />

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start h-12 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Abmelden</div>
                <div className="text-xs text-red-600">Sitzung beenden</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <KeyRound className="w-5 h-5 mr-2 text-orange-600" />
              Passwort zurücksetzen
            </DialogTitle>
            <DialogDescription>
              Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen ein neues temporäres Passwort.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="resetEmail">E-Mail-Adresse *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`pl-10 ${resetErrors.email ? "border-red-500" : ""}`}
                  placeholder="ihre@email.com"
                  disabled={isResettingPassword}
                />
              </div>
              {resetErrors.email && <p className="text-red-500 text-sm mt-1">{resetErrors.email}</p>}
            </div>

            {/* Status Messages */}
            {resetStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-700 font-medium">E-Mail gesendet!</p>
                    <p className="text-green-600 text-sm mt-1">{resetMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {resetStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-red-700 font-medium">Fehler</p>
                    <p className="text-red-600 text-sm mt-1">{resetMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePasswordReset}
                disabled={isResettingPassword || !resetEmail.trim() || resetStatus === "success"}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isResettingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Neues Passwort anfordern
                  </>
                )}
              </Button>

              <Button
                onClick={closePasswordReset}
                variant="outline"
                disabled={isResettingPassword}
                className="flex-1 bg-transparent"
              >
                {resetStatus === "success" ? "Schließen" : "Abbrechen"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
