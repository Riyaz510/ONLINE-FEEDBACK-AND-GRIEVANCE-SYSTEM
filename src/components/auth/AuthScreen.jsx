import { useState } from 'react'
import { Eye, EyeOff, Shield, Users, FileText } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'

export function AuthScreen({ onLogin, onRegister, usersCount }) {
  const [mode, setMode] = useState(usersCount > 0 ? "login" : "register")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (mode === "login") {
        await onLogin({ email: form.email, password: form.password })
      } else {
        await onRegister({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        })
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12">
          <div className="mx-auto max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GrievanceHub</h1>
                <p className="text-sm text-gray-600">Professional Feedback System</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Submit & Track</h3>
                  <p className="text-sm text-gray-600">Submit grievances and track their progress in real-time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Collaborative</h3>
                  <p className="text-sm text-gray-600">Admins can assign, prioritize, and resolve issues efficiently</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade security with encrypted passwords</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="mx-auto w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </CardTitle>
                <CardDescription className="text-center">
                  {mode === "login"
                    ? "Sign in to access your grievance dashboard"
                    : "Join our secure feedback platform"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={mode === "register" ? "Create a strong password" : "Enter your password"}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {mode === "register" && (
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum 8 characters with SHA-256 + bcrypt encryption
                      </p>
                    )}
                  </div>

                  {mode === "register" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                      >
                        <option value="user">User - Submit grievances</option>
                        <option value="admin">Admin - Manage system</option>
                      </select>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                  >
                    {mode === "login" 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                {usersCount === 0 && mode === "register" && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">
                      💡 First account created will have admin privileges
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}