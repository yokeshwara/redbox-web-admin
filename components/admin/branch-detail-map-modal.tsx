'use client'

import { X, MapPin, Phone, Mail, Clock, Star, Navigation } from 'lucide-react'

export function BranchDetailMapModal({
  branch,
  onClose,
}: {
  branch: any
  onClose: () => void
}) {
  if (!branch) return null

  const openInMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white z-10">
          <h2 className="text-2xl font-bold">{branch.name} - Location</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Map Container */}
          <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-6 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKeyForDemo&q=${branch.latitude},${branch.longitude}`}
            ></iframe>
          </div>

          {/* Branch Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Info */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                Contact
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Phone:</span>
                  <br />
                  <span className="font-semibold text-foreground">{branch.phone}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>
                  <br />
                  <span className="font-semibold text-foreground">{branch.email}</span>
                </p>
              </div>
            </div>

            {/* Hours Info */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Hours
              </h3>
              <p className="text-sm font-semibold text-foreground">{branch.hours}</p>
            </div>

            {/* Address */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all md:col-span-2">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                Address
              </h3>
              <p className="text-sm font-semibold text-foreground">{branch.address}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Coordinates: {branch.latitude}, {branch.longitude}
              </p>
            </div>

            {/* Rating Info */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-500" />
                Rating
              </h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-yellow-500">{branch.rating}</p>
                <p className="text-xs text-muted-foreground">{branch.reviews} reviews</p>
              </div>
            </div>

            {/* Delivery Partners */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
              <h3 className="font-bold text-foreground mb-4">Delivery Available On</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Swiggy</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Zomato</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 flex-col md:flex-row">
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
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
