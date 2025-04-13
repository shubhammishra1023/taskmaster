"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  Home,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Star,
  User,
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationSearch } from "@/components/location-search"
import { toast } from "sonner"

export default function DashboardPage() {
  const [isConsumer] = useState(true)

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)
  const [nearbyProviders, setNearbyProviders] = useState([])
  const [isLoadingProviders, setIsLoadingProviders] = useState(false)
  const { data: session } = useSession()
  const handleLocationFound = async (location: {
    latitude: number
    longitude: number
    address: string
  }) => {
    setCurrentLocation(location)

    if (session?.user.role === "consumer") {
      fetchNearbyProviders(location)
    }
  }

  const fetchNearbyProviders = async (location: {
    latitude: number
    longitude: number
  }) => {
    setIsLoadingProviders(true)

    try {
      const response = await fetch(
        `/api/providers/nearby?lat=${location.latitude}&lng=${location.longitude}&radius=10000`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch nearby providers")
      }

      const providers = await response.json()
      setNearbyProviders(providers)
    } catch (error) {
      console.error("Error fetching nearby providers:", error)
      toast.error("Failed to find service providers in your area")
    } finally {
      setIsLoadingProviders(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">s
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-semibold ml-7">
                    <span>TaskMaster</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/messages" className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link href="/dashboard/bookings" className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Bookings</span>
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-3xl ml-7">
              <span className="hidden md:inline-block">TaskMaster</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <form className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-64 pl-8" />
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/messages" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link href="/dashboard/bookings" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <Calendar className="h-5 w-5" />
              <span>Bookings</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {isConsumer ? "lala" : "Service Provider"}!</p>
            </div>

            {isConsumer ? (
              <Tabs defaultValue="nearby">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="nearby">Nearby Services</TabsTrigger>
                    <TabsTrigger value="recent">Recent Bookings</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <LocationSearch onLocationFound={handleLocationFound} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Filter
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Rating (High to Low)</DropdownMenuItem>
                        <DropdownMenuItem>Distance (Near to Far)</DropdownMenuItem>
                        <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
                        <DropdownMenuItem>Availability</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <TabsContent value="nearby" className="mt-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/placeholder.svg" alt="Avatar" />
                              <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {
                                  [
                                    "John's Plumbing",
                                    "Green Gardens",
                                    "ElectriTech",
                                    "Clean Sweep",
                                    "Fix-It Felix",
                                    "Chef Maria",
                                  ][i - 1]
                                }
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                <span>{Math.floor(Math.random() * 5) + 0.1} miles away</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${j < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                />
                              ))}
                            <span className="text-xs text-muted-foreground ml-1">(42 reviews)</span>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Available today</span>
                            </div>
                            <p className="line-clamp-2">
                              Professional service with 10+ years of experience. Fast response and quality work
                              guaranteed.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="recent" className="mt-4">
                  <div className="rounded-lg border">
                    <div className="p-4">
                      <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                                <AvatarFallback>SP</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {["John's Plumbing", "Green Gardens", "ElectriTech"][i - 1]}
                                </h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  <span>{["Yesterday", "Last week", "2 weeks ago"][i - 1]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                              <Button size="sm">Book Again</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="favorites" className="mt-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/placeholder.svg" alt="Avatar" />
                              <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{["Chef Maria", "Green Gardens", "ElectriTech"][i - 1]}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                <span>{Math.floor(Math.random() * 5) + 0.1} miles away</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${j < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                />
                              ))}
                            <span className="text-xs text-muted-foreground ml-1">(42 reviews)</span>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Available today</span>
                            </div>
                            <p className="line-clamp-2">
                              Professional service with 10+ years of experience. Fast response and quality work
                              guaranteed.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Tabs defaultValue="requests">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="requests">Service Requests</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled Services</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Update Availability
                    </Button>
                  </div>
                </div>
                <TabsContent value="requests" className="mt-4">
                  <div className="rounded-lg border">
                    <div className="p-4">
                      <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{["John Doe", "Jane Smith", "Alex Johnson"][i - 1]}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  <span>Requested for {["Tomorrow", "Next week", "This weekend"][i - 1]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                              <Button size="sm">Accept</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="scheduled" className="mt-4">
                  <div className="rounded-lg border">
                    <div className="p-4">
                      <div className="grid gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{["Robert Brown", "Sarah Wilson"][i - 1]}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  <span>Scheduled for {["Tomorrow, 2PM", "Friday, 10AM"][i - 1]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                  <div className="rounded-lg border">
                    <div className="p-4">
                      <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {["Michael Davis", "Emily Taylor", "David Miller"][i - 1]}
                                </h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  <span>Completed {["Yesterday", "Last week", "2 weeks ago"][i - 1]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {Array(5)
                                  .fill(0)
                                  .map((_, j) => (
                                    <Star
                                      key={j}
                                      className={`h-4 w-4 ${j < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                    />
                                  ))}
                              </div>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}