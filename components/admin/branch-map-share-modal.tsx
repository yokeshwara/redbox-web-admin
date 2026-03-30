'use client'

import { X, Copy, Navigation, MapPin } from 'lucide-react'
import { useState } from 'react'

export function BranchMapShareModal({
  branch,
  onClose,
}: {
  branch: any
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  if (!branch) return null

  // Extract the actual maps URL/iframe src from the stored data
  const extractMapsData = () => {
    if (branch.maps_iframe) {
      // Try to extract URL from iframe src attribute
      const srcMatch = branch.maps_iframe.match(/src=["']([^"']+)["']/i)
      if (srcMatch && srcMatch[1]) {
        const iframeSrc = srcMatch[1]
        // Check if it's a maps.app.goo.gl short URL stored in iframe
        if (iframeSrc.includes('maps.app.goo.gl') || iframeSrc.includes('google.com/maps')) {
          return {
            mapsUrl: iframeSrc,
            embedUrl: iframeSrc
          }
        }
        // If it's an embed URL, return it as is
        return {
          mapsUrl: iframeSrc,
          embedUrl: iframeSrc
        }
      }
      // If no src attribute found, check if the whole string is a URL
      if (branch.maps_iframe.includes('http')) {
        return {
          mapsUrl: branch.maps_iframe.trim(),
          embedUrl: branch.maps_iframe.trim()
        }
      }
    }
    // Fallback to address search if no iframe
    if (branch.address) {
      const addressUrl = `https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`
      return {
        mapsUrl: addressUrl,
        embedUrl: addressUrl
      }
    }
    // Last fallback
    return {
      mapsUrl: 'https://www.google.com/maps',
      embedUrl: 'https://www.google.com/maps'
    }
  }

  const { mapsUrl, embedUrl } = extractMapsData()

  const openInMaps = () => {
    window.open(mapsUrl, '_blank')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mapsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white">
          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <h2 className="text-xl font-bold">{branch.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Location Info */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Location</p>
            <p className="text-lg font-bold text-foreground">{branch.address || branch.city}</p>
            {branch.city && <p className="text-sm text-muted-foreground">City: {branch.city}</p>}
            {branch.phone && <p className="text-sm text-muted-foreground">Phone: {branch.phone}</p>}
          </div>

          {/* Map Link */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Map Link</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-lg">
              <input
                type="text"
                value={mapsUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-foreground outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-primary"
                title="Copy link"
              >
                <Copy size={18} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600">Link copied to clipboard!</p>}
          </div>

          {/* Map Preview */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Map Preview</p>
            <div className="w-full h-56 rounded-lg overflow-hidden border-2 border-primary/20 bg-gray-50 flex items-center justify-center">
              {branch.maps_iframe ? (
                <div className="text-center p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Map location from iframe</p>
                  <button
                    onClick={openInMaps}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    View Map Location
                  </button>
                  <p className="text-xs text-muted-foreground">{mapsUrl}</p>
                </div>
              ) : branch.address ? (
                <div className="text-center p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Location: {branch.address}</p>
                  <button
                    onClick={openInMaps}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    View Map Location
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">No map data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={openInMaps}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={18} />
              Open in Google Maps
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-foreground font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
