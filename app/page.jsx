"use client"

import { Heart, CheckCircle, XCircle, ArrowRight, Menu, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

import { useRouter } from "next/navigation"; 


export default function HomePage() {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: 65,
          location: "Assam",
          bloodgroup: "AB-",
          organ: "Kidney",
          tissue_type: "HLA-DR",
          urgency: 1,
        }),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        alert("Backend did not return valid JSON:\n" + text);
        return;
      }

      if (response.ok) {
        if (data.matches.length > 0) {
          // ✅ store matches in sessionStorage
          sessionStorage.setItem("matches", JSON.stringify(data.matches));

          // ✅ redirect to /matches
          router.push("/matches");
        } else {
          alert("No matches found");
        }
      } else {
        alert(data.message || "Error occurred");
      }
    } catch (error) {
      console.error("Error running match:", error.message, error.stack);
      alert("Failed to run match process.");
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center ">
              {/* <Heart className="h-8 w-8 text-emerald-600 mr-2" /> */}
              <img
  src="/logo.jpg"
  alt="LifeBridge Logo"
  className="h-15 w-auto"/>
              <span className="text-xl font-bold text-gray-900"></span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</Link>
              <Link href="#facts" className="text-gray-700 hover:text-emerald-600 transition-colors">Facts</Link>
              <Link href="#stories" className="text-gray-700 hover:text-emerald-600 transition-colors">Stories</Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors">Login</Link>
              <Link href="/auth/register">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Register</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</Link>
                <Link href="#facts" className="text-gray-700 hover:text-emerald-600 transition-colors">Facts</Link>
                <Link href="#stories" className="text-gray-700 hover:text-emerald-600 transition-colors">Stories</Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors">Login</Link>
                <Link href="/auth/register">
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-700 w-full">Register</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
          
     {/* Hero Section */}
<section
  className="relative bg-cover bg-center h-screen"
  style={{
    backgroundImage:
      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWIzuIAGLWGmKM4EMrCVr35wfwmE3qmUGMy6BC57yuKgRN8arwCM9hM3Q_i229qBufIOUDGE0108qWNgoCfqfJb2IRYsljyKFZo6NvatCaVhNvPEAt2yKX7iQCSrjZenBaIaEPr91k5mRxmZoCw3ft4ichbUoelOlOl-0vmmqSfcesmQ9cd2BqL0o0RNDHUx8gS-6UQzAp2Zl5b8GxSzPNL_b93KuYOfeJRgoOviTTMjqHhYoB5y1NpHB4_K4tn3KzpGyUdvZC08c')",
  }}
>
  <div className="absolute inset-0 bg-black/40"></div>
  <div className="container mx-auto px-6 h-full flex flex-col justify-center items-start relative z-10">
    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
      Your Gift, Their Future.
    </h1>
    <p className="text-xl md:text-2xl mt-4 mb-8 text-white">
      Become an organ donor and give the gift of life.
    </p>
    <Link href="/auth/register">
      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center shadow-lg">
        Register Today
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
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
              <img src="/heart.png" alt="Heart" className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Heart</h3>
              <p className="text-sm text-muted-foreground">Can save 1 life</p>
            </Card>

            <Card className="text-center p-6">
              <img src="/kidney.png" alt="Kidneys" className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kidneys</h3>
              <p className="text-sm text-muted-foreground">Can save 2 lives</p>
            </Card>

            <Card className="text-center p-6">
              <img src="/liver.png" alt="Liver" className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Liver</h3>
              <p className="text-sm text-muted-foreground">Can save 1 life</p>
            </Card>

            <Card className="text-center p-6">
              <img src="/eye.png" alt="Eyes" className="h-12 w-12 mx-auto mb-4" />
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
                    <Button className="bg-white text-emerald-600 hover:bg-gray-100 border-0">About organ donation</Button>
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
                  <Link href="/auth/match/app" className="block">





 <Button
        variant="outline"
        className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
        size="lg"
        onClick={handleClick}
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
              Have questions or concerns? Get the facts about the organ donation process, opt-out system, family involvement, and more.
            </p>
            <Button variant="outline">Get the facts now</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8 border-2 border-primary">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">DONATE</h3>
              <p className="text-muted-foreground">Register to save lives</p>
              <Link href="/auth/register">
                <Button className="mt-6" size="lg">Register Now</Button>
              </Link>
            </Card>

            <Card className="text-center p-8 border-2 border-destructive">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">DO NOT DONATE</h3>
              <p className="text-muted-foreground">Record your decision not to donate</p>
              <Button variant="destructive" className="mt-6" size="lg">Opt Out</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">More Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <img src="/who.jpg" alt="Who can donate" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Who can donate?</h3>
                <p className="text-muted-foreground mb-4">
                  Are you eligible? Learn about medical requirements and restrictions for donors. Certain health conditions, travel history, or medications may affect your ability to donate. These guidelines are in place to ensure the safety of both you and the recipient. A quick screening will help determine your eligibility, so it’s always best to review the latest criteria before donating.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img src="/how.jpg" alt="Impact of donors" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">How donors change lives</h3>
                <p className="text-muted-foreground mb-4">
                  Every donation has the power to transform someone’s future. Behind each gift is a story of renewed health, hope, and second chances. Read inspiring accounts from recipients whose lives were forever changed by the generosity of organ donors.
                </p>
                
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img src="/law.jpg" alt="Law changes" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">The law has changed</h3>
                <p className="text-muted-foreground mb-4">
                  How donors change lives – Every donation has the power to transform someone’s future. Behind each gift is a story of renewed health, hope, and second chances. Read inspiring accounts from recipients whose lives were forever changed by the generosity of organ donors.
                </p>
               
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
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Phone className="h-4 w-4" />+</Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Mail className="h-4 w-4" /></Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">About Donation</Link></li>
                <li><Link href="#facts" className="text-gray-400 hover:text-white transition-colors">Facts & Stats</Link></li>
                <li><Link href="#stories" className="text-gray-400 hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Register Now</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2">
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Patient Login</Link></li>
                <li><Link href="/donor/dashboard" className="text-gray-400 hover:text-white transition-colors">Donor Dashboard</Link></li>
                <li><Link href="/receiver/dashboard" className="text-gray-400 hover:text-white transition-colors">Receiver Dashboard</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Find a Match</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400"><Phone className="h-4 w-4 mr-2" /> <span>+91-7699419953</span></div>
                <div className="flex items-center text-gray-400"><Mail className="h-4 w-4 mr-2" /> <span>indranildhara2005@gmail.com</span></div>
                <div className="flex items-center text-gray-400"><MapPin className="h-4 w-4 mr-2" /> <span>Barasat ,Kolkata-700124</span></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 text-gray-500">
            © 2025 LifeBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}