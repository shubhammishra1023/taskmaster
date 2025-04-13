"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface LocationSearchProps {
  onLocationFound: (location: {
    latitude: number
    longitude: number
    address: string
    city?: string
    state?: string
    zipCode?: string
  }) => void
}

export function LocationSearch({ onLocationFound }: LocationSearchProps) {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleSearch = async () => {
    if (!address.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/location/geocode?address=${encodeURIComponent(address)}`)

      if (!response.ok) {
        throw new Error("Failed to find location")
      }

      const locationData = await response.json()

      onLocationFound({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.formattedAddress,
        city: locationData.city,
        state: locationData.state,
        zipCode: locationData.zipCode,
      })

      toast("Location found", {
        description: locationData.formattedAddress,
      })
    } catch (error) {
      console.error("Location search error:", error)
      toast.error("Failed to find location", {
        description: "Please check the address and try again",
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter location..."
          className="pl-8"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button onClick={handleSearch} disabled={!address.trim() || isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  )
}

