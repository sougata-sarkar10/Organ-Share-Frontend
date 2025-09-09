"use client"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Menu, X, LogOut, User, Home } from "lucide-react"
import Link from "next/link"

export default function Navigation() {
  const { isAuthenticated, user, userType, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">LifeBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link href="/#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
                <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How It Works
                </Link>
                <Link href="/#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={userType === "donor" ? "/donor/dashboard" : "/receiver/dashboard"}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{user?.name}</span>
                  <Badge
                    variant="secondary"
                    className={userType === "donor" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                  >
                    {userType === "donor" ? "Donor" : "Receiver"}
                  </Badge>
                </div>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/#about"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/#contact"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">{user?.name}</span>
                      <Badge
                        variant="secondary"
                        className={userType === "donor" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        {userType === "donor" ? "Donor" : "Receiver"}
                      </Badge>
                    </div>
                  </div>
                  <Link
                    href={userType === "donor" ? "/donor/dashboard" : "/receiver/dashboard"}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
