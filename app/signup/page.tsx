"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "consumer"
  const [isLoading, setIsLoading] = useState(false)

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [address, setAddress] = useState("")

  const handleLocationSearch = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
      if (!response.ok) throw new Error("Failed to geocode address")

      const locationData = await response.json()
      console.log("Location data:", locationData)

      // You can store this data in state if needed
      toast.success("Location found", {
        description: locationData.formattedAddress
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to find location"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get location data
      let locationData = null
      if (address) {
        const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
        if (response.ok) {
          locationData = await response.json()
        }
      }

      // Register user
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone,
        role: type,
        serviceType: type === "provider" ? serviceType : null,
        location: locationData
          ? {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              address: locationData.formattedAddress,
              city: locationData.city,
              state: locationData.state,
              zipCode: locationData.zipCode,
            }
          : null,
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      toast.success("Account created successfully", {
        description: "Please log in to continue",
      })
      router.push("/login")
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Registration failed", {
      description: error instanceof Error ? error.message : "Failed to create account",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-3xl font-bold">
        <span>TaskMaster</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Sign up to start finding or offering services</p>
        </div>
        <Tabs defaultValue={type} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consumer">Consumer</TabsTrigger>
            <TabsTrigger value="provider">Service Provider</TabsTrigger>
          </TabsList>
          <TabsContent value="consumer">
            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        disabled={isLoading}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        disabled={isLoading}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      disabled={isLoading}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="address"
                        placeholder="123 Main St, City, State"
                        disabled={isLoading}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLocationSearch}
                        disabled={!address || isLoading}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline underline-offset-4">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  <Button disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
                </div>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="provider">
            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="provider-first-name">First name</Label>
                      <Input
                        id="provider-first-name"
                        placeholder="John"
                        disabled={isLoading}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="provider-last-name">Last name</Label>
                      <Input
                        id="provider-last-name"
                        placeholder="Doe"
                        disabled={isLoading}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-email">Email</Label>
                    <Input
                      id="provider-email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-password">Password</Label>
                    <Input
                      id="provider-password"
                      type="password"
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-phone">Phone number</Label>
                    <Input
                      id="provider-phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      disabled={isLoading}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="service-type">Service type</Label>
                    <Input
                      id="service-type"
                      placeholder="e.g., Plumbing, Cooking, Gardening"
                      disabled={isLoading}
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-address">Business Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="provider-address"
                        placeholder="123 Main St, City, State"
                        disabled={isLoading}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLocationSearch}
                        disabled={!address || isLoading}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="provider-terms" required />
                    <Label
                      htmlFor="provider-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline underline-offset-4">
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  <Button disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

