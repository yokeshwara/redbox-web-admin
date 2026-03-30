'use client'

import { MapPin, Phone, Mail, Clock, Users, TrendingUp, Star } from 'lucide-react'

interface BranchPremiumCardProps {
  id: number
  name: string
  city: string
  rating: number
  reviews: number
  phone: string
  email: string
  status: 'Active' | 'Inactive'
  ordersToday: number
  revenue: string
  hours: string
  image?: string
}

export function BranchPremiumCard({
  id,
  name,
  city,
  rating,
  reviews,
  phone,
  email,
  status,
  ordersToday,
  revenue,
  hours,
  image,
}: BranchPremiumCardProps) {
  return (
    <div className="group bg-gradient-to-br from-white via-primary/2 to-primary/5 rounded-2xl overflow-hidden border-2 border-primary/30 hover:border-primary/60 hover:shadow-2xl transition-all duration-300">
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-sm">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-600">({reviews})</span>
          </div>
          <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
            status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {status}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm">{city}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-primary flex-shrink-0" />
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-primary flex-shrink-0" />
            <a href={`mailto:${email}`} className="text-primary hover:underline">
              {email}
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/20">
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{ordersToday}</div>
            <div className="text-xs text-gray-600 mt-1">Orders Today</div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary flex items-center justify-center gap-1">
              <TrendingUp size={16} />
              {revenue}
            </div>
            <div className="text-xs text-gray-600 mt-1">Revenue</div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-foreground">{hours}</div>
            <div className="text-xs text-gray-600 mt-1">Hours</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button className="flex-1 px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
            View Details
          </button>
          <button className="flex-1 px-3 py-2 border-2 border-primary/30 text-primary rounded-lg font-semibold text-sm hover:bg-primary/5 transition-all">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
