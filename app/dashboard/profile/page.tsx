/*"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // User profile data
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  // Provider-specific data
  const [serviceType, setServiceType] = useState("")
  const [description, setDescription] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [skills, setSkills] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")

      const profileData = await response.json()

      setFirstName(profileData.firstName || "")
      setLastName(profileData.lastName || "")
      setPhone(profileData.phone || "")

      if (profileData.location) {
        setAddress(profileData.location.address || "")
      }

      if (profileData.providerProfile) {
        setServiceType(profileData.providerProfile.serviceType || "")
        setDescription(profileData.providerProfile.description || "")
        setHourlyRate(profileData.providerProfile.hourlyRate?.toString() || "")
        setSkills(profileData.providerProfile.skills?.join(", ") || "")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error", {
        description: "Failed to load profile data"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSearch = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
      if (!response.ok) throw new Error("Failed to geocode address")

      const locationData = await response.json()
      setAddress(locationData.formattedAddress)

      toast.success("Location verified", {
        description: locationData.formattedAddress
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to verify location"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let locationData = null
      if (address) {
        const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
        if (response.ok) {
          locationData = await response.json()
        }
      }

      const profileData: any = {
        firstName,
        lastName,
        phone,
      }

      if (locationData) {
        profileData.location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.formattedAddress,
          city: locationData.city,
          state: locationData.state,
          zipCode: locationData.zipCode,
        }
      }

      if (session?.user.role === "provider") {
        profileData.serviceType = serviceType
        profileData.description = description
        profileData.hourlyRate = hourlyRate ? Number.parseFloat(hourlyRate) : undefined
        profileData.skills = skills ? skills.split(",").map((skill) => skill.trim()) : undefined
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      toast.success("Success", {
        description: "Profile updated successfully"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update profile"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account details and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="(123) 456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationSearch}
                    disabled={!address || isLoading}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>
            </div>

            {session?.user.role === "provider" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Service Provider Details</h2>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Service type</Label>
                  <Input
                    id="service-type"
                    placeholder="e.g., Plumbing, Cooking, Gardening"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">Hourly rate ($)</Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      placeholder="25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      placeholder="Repair, Installation, Maintenance"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}*/

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // User profile data
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [languagePreference, setLanguagePreference] = useState("")

  // Provider-specific data
  const [serviceType, setServiceType] = useState("")
  const [description, setDescription] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [skills, setSkills] = useState("")
  const [aadhaarCard, setAadhaarCard] = useState<File | null>(null)
  const [certificate, setCertificate] = useState<File | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")

      const profileData = await response.json()

      setFirstName(profileData.firstName || "")
      setLastName(profileData.lastName || "")
      setPhone(profileData.phone || "")
      setLanguagePreference(profileData.languagePreference || "")

      if (profileData.location) {
        setAddress(profileData.location.address || "")
      }

      if (profileData.providerProfile) {
        setServiceType(profileData.providerProfile.serviceType || "")
        setDescription(profileData.providerProfile.description || "")
        setHourlyRate(profileData.providerProfile.hourlyRate?.toString() || "")
        setSkills(profileData.providerProfile.skills?.join(", ") || "")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error", {
        description: "Failed to load profile data"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSearch = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
      if (!response.ok) throw new Error("Failed to geocode address")

      const locationData = await response.json()
      setAddress(locationData.formattedAddress)

      toast.success("Location verified", {
        description: locationData.formattedAddress
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to verify location"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let locationData = null
      if (address) {
        const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)
        if (response.ok) {
          locationData = await response.json()
        }
      }

      const profileData: any = {
        firstName,
        lastName,
        phone,
      }

      if (locationData) {
        profileData.location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.formattedAddress,
          city: locationData.city,
          state: locationData.state,
          zipCode: locationData.zipCode,
        }
      }

      if (session?.user.role === "consumer") {
        profileData.languagePreference = languagePreference
      }

      if (session?.user.role === "provider") {
        profileData.serviceType = serviceType
        profileData.description = description
        profileData.hourlyRate = hourlyRate ? Number.parseFloat(hourlyRate) : undefined
        profileData.skills = skills ? skills.split(",").map((skill) => skill.trim()) : undefined
        profileData.hasAadhaar = !!aadhaarCard
        profileData.hasCertificate = !!certificate
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      toast.success("Saved", {
        description: "We will soon inform you after verification."
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update profile"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="container max-w-4xl py-10">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight ml-5">Profile Settings</h1>
          <p className="text-muted-foreground ml-5">Manage your account details and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-4 ml-5">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 ml-5">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2 ml-5">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2 ml-5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="(123) 456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 ml-5">
                <Label htmlFor="address">Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationSearch}
                    disabled={!address || isLoading}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>
            </div>

            {session?.user.role === "consumer" && (
              <div className="space-y-4 ml-4">
                <div className="space-y-2 ml-4">
                  <Label htmlFor="language-preference">Language Preference</Label>
                  <Input
                    id="language-preference"
                    placeholder="e.g., English, Hindi"
                    value={languagePreference}
                    onChange={(e) => setLanguagePreference(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {session?.user.role === "provider" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Service Provider Details</h2>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Service type</Label>
                  <Input
                    id="service-type"
                    placeholder="e.g., Plumbing, Cooking, Gardening"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">Hourly rate ($)</Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      placeholder="25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      placeholder="Repair, Installation, Maintenance"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Card</Label>
                  <Input
                    id="aadhaar"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setAadhaarCard(e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">Skill Certificate (Optional)</Label>
                  <Input
                    id="certificate"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

