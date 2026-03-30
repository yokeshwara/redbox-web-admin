'use client'

import { useEffect, useState } from 'react'

interface Banner {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export function BannerDisplay() {
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load banners from localStorage
    const stored = localStorage.getItem('banners')
    if (stored) {
      try {
        const banners: Banner[] = JSON.parse(stored)
        const active = banners.find((b) => b.isActive)
        setActiveBanner(active || null)
      } catch {
        // If parsing fails, use default
        setActiveBanner(null)
      }
    } else {
      // Use default banner if no stored banners
      setActiveBanner({
        id: '1',
        title: 'Welcome to Redbox Restaurant',
        subtitle: 'Authentic flavors, exceptional taste',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
      })
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-red-500 to-red-600 rounded-lg overflow-hidden animate-pulse" />
    )
  }

  if (!activeBanner) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No active banner available</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <img
          src={activeBanner.imageUrl}
          alt={activeBanner.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {activeBanner.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white drop-shadow-md">
            {activeBanner.subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
