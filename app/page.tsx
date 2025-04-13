import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, MapPin, Shield, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-3xl ml-7">
            <span>TaskMaster</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-lg font-medium transition duration-300 hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-lg font-medium transition duration-300 hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-green-400 hover:via-blue-500 hover:to-purple-600"
            >
              How It Works
            </Link>
            <Link
              href="#services"
              className="text-lg font-medium transition duration-300 hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-yellow-400 hover:via-pink-500 hover:to-red-500"
            >
              Services
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <span className="block">"No Task, Too Tough"</span>
                    <span className="block">Connect Directly with Local Service Providers</span>
                  </h1>

                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Find and hire skilled professionals like cooks, gardeners, plumbers, and electricians without
                    middlemen. Negotiate prices directly and get the service you need.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup?type=consumer">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Find Services
                    </Button>
                  </Link>
                  <Link href="/signup?type=provider">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Become a Provider
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">John's Plumbing</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground ml-1">(42 reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">2.3 miles away</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Available today</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Background verified</span>
                        </div>
                      </div>
                      <Button className="w-full">Contact Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Choose ServiceConnect?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers unique advantages that make finding and hiring service providers easier than ever.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Verified Providers</h3>
                <p className="text-center text-muted-foreground">
                  All service providers undergo identity verification and background checks for your safety and peace of
                  mind.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Direct Communication</h3>
                <p className="text-center text-muted-foreground">
                  Connect and negotiate directly with service providers without any middlemen or additional fees.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Ratings & Reviews</h3>
                <p className="text-center text-muted-foreground">
                  Make informed decisions based on genuine ratings and reviews from other consumers in your community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to find and hire the right service provider in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-center text-muted-foreground">
                  Create an account as a consumer or service provider with verified credentials.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Browse Services</h3>
                <p className="text-center text-muted-foreground">
                  Search for service providers based on location, ratings, and availability.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Connect & Negotiate</h3>
                <p className="text-center text-muted-foreground">
                  Contact providers directly, discuss your needs, and agree on pricing.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="text-xl font-bold">Book & Review</h3>
                <p className="text-center text-muted-foreground">
                  Schedule the service, make secure payments, and leave reviews after completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Service Categories
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Find the Right Professional</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse through our wide range of service categories to find the perfect match for your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Cooking", icon: "🍳", description: "Personal chefs, meal prep, catering services" },
                { name: "Gardening", icon: "🌱", description: "Lawn care, landscaping, plant maintenance" },
                { name: "Plumbing", icon: "🔧", description: "Repairs, installations, maintenance" },
                { name: "Electrical", icon: "⚡", description: "Wiring, fixtures, safety inspections" },
                { name: "Cleaning", icon: "🧹", description: "Home cleaning, deep cleaning, organizing" },
                { name: "Carpentry", icon: "🔨", description: "Furniture repair, custom builds, installations" },
                { name: "Painting", icon: "🎨", description: "Interior, exterior, decorative painting" },
                { name: "Tutoring", icon: "📚", description: "Academic subjects, test prep, skills coaching" },
              ].map((service, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="text-center text-muted-foreground">{service.description}</p>
                  <Link href={`/services/${service.name.toLowerCase()}`} className="mt-4">
                    <Button variant="outline" size="sm">
                      Browse Providers
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Join Today
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to get started?</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Sign up now to find reliable service providers in your area or offer your services to those who need
                    them.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup?type=consumer">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Find Services
                    </Button>
                  </Link>
                  <Link href="/signup?type=provider">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Become a Provider
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Join our growing community</h3>
                    <p className="text-muted-foreground">
                      Connect with thousands of service providers and consumers in your area.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm">Over 10,000 verified service providers</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm">Serving 50+ cities nationwide</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm">Thousands of satisfied customers</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm">Secure payments and verified reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4">

          {/* Social Icons */}
          <div className="flex gap-6 justify-center">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Facebook className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-[#1877F2]" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Twitter className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-[#1DA1F2]" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Instagram className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-[#E1306C]" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-[#0A66C2]" />
            </Link>
          </div>

          {/* Footer Text and Links */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}

