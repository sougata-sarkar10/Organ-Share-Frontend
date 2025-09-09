"use client"

import { Heart, CheckCircle, XCircle, ArrowRight, Menu, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-emerald-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">LifeBridge</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">
                About
              </Link>
              <Link href="#facts" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Facts
              </Link>
              <Link href="#stories" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Stories
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Login
              </Link>
              <Link href="/auth/register">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Register</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  About
                </Link>
                <Link href="#facts" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Facts
                </Link>
                <Link href="#stories" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Stories
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-700 w-full">Register</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 text-balance">Organ Donation</h1>
              <p className="text-xl mb-8 text-balance opacity-90">Two minutes now could save up to nine lives</p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold border-0">
                  Get registered as a Donor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="/diverse-person-smiling--healthcare--hope.jpg"
                alt="Person who benefited from organ donation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Organ Donation</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Organ donation is the process of surgically removing an organ or tissue from one person (the organ donor)
              and placing it into another person (the recipient). Transplantation is necessary because the recipient's
              organ has failed or has been damaged by disease or injury.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Heart</h3>
              <p className="text-sm text-muted-foreground">Can save 1 life</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">K</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kidneys</h3>
              <p className="text-sm text-muted-foreground">Can save 2 lives</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">L</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Liver</h3>
              <p className="text-sm text-muted-foreground">Can save 1 life</p>
            </Card>
            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">E</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Eyes</h3>
              <p className="text-sm text-muted-foreground">Can restore sight to 2 people</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Basics Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Let's start with the basics</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden">
              <div className="relative">
                <img src="/placeholder-0g0kt.png" alt="What is organ donation" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h3 className="text-2xl font-bold mb-2">What is organ donation?</h3>
                    <p className="mb-4">Find out what's involved, who you could help and what happens next.</p>
                    <Button className="bg-white text-emerald-600 hover:bg-gray-100 border-0">
                      About organ donation
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Register your decision</h3>
                <p className="text-muted-foreground mb-6">
                  Join the NHS Organ Donor Register and let your family know your decision.
                </p>
                <div className="space-y-3">
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700" size="lg">
                      Register as Donor
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      size="lg"
                    >
                      Find a Match as Receiver
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Facts Section */}
      <section id="facts" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Facts</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or concerns?
              <br />
              Get the facts about the organ donation process, opt out system, family involvement and more.
            </p>
            <Button variant="outline">Get the facts now</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8 border-2 border-primary">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">DONATE</h3>
              <p className="text-muted-foreground">Register to save lives</p>
              <Link href="/auth/register">
                <Button className="mt-6" size="lg">
                  Register Now
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-8 border-2 border-destructive">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">DO NOT DONATE</h3>
              <p className="text-muted-foreground">Record your decision not to donate</p>
              <Button variant="destructive" className="mt-6" size="lg">
                Opt Out
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Information Cards */}
      <section id="stories" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">More information</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <img src="/placeholder-eahzy.png" alt="Who can donate" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Who can donate?</h3>
                <p className="text-muted-foreground mb-4">
                  Are you a medical candidate? Are you a smoker, or too young or old? You may still be able to become an
                  organ donor. Get the facts about eligibility here.
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="/placeholder-h9rn1.png"
                alt="How organ donors change lives"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">How organ donors change lives</h3>
                <p className="text-muted-foreground mb-4">
                  Read about people whose lives have been transformed by organ donation, and those waiting for a
                  transplant.
                </p>
                <Button variant="outline">Read Stories</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="/hands-holding-red-heart--medical-care--compassion-.jpg"
                alt="The law has changed"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">The law has changed</h3>
                <p className="text-muted-foreground mb-4">
                  Organ donation law has changed. Read about how these changes affect you, and as always know too.
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Making a Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">6,000+</div>
              <p className="text-lg opacity-90">People waiting for transplants</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <p className="text-lg opacity-90">People die daily waiting for organs</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9</div>
              <p className="text-lg opacity-90">Lives can be saved by one donor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Ready to save lives?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of people who have already registered their decision to donate organs and save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 bg-emerald-600 text-white hover:bg-emerald-700">
                Register as Donor
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Find a Match
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-emerald-400 mr-2" />
                <span className="text-xl font-bold">LifeBridge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting donors and recipients to save lives through organ donation.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About Donation
                  </Link>
                </li>
                <li>
                  <Link href="#facts" className="text-gray-400 hover:text-white transition-colors">
                    Facts & Stats
                  </Link>
                </li>
                <li>
                  <Link href="#stories" className="text-gray-400 hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                    Register Now
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                    Patient Login
                  </Link>
                </li>
                <li>
                  <Link href="/donor/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Donor Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/receiver/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Receiver Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Find a Match
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1-800-DONATE-1</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>help@lifebridge.org</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>24/7 Emergency Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 LifeBridge Organ Donation Platform. All rights reserved. |
              <Link href="#" className="hover:text-white ml-1">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="#" className="hover:text-white ml-1">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
