'use client'

import { Star, Flame, Leaf, TrendingUp, ShoppingCart, Eye } from 'lucide-react'

interface MenuItemCardProps {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  isTrending?: boolean
  isVeg?: boolean
  views: number
  orders: number
  discount?: number
}

export function MenuItemPremiumCard({
  id,
  name,
  category,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  isTrending = false,
  isVeg = true,
  views,
  orders,
  discount,
}: MenuItemCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary/60 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isTrending && (
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
              <Flame size={14} />
              Trending
            </div>
          )}
          {isVeg && (
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded">
              <Leaf size={16} />
            </div>
          )}
          {discount && (
            <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Category Badge */}
        <div className="text-xs font-bold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full w-fit">
          {category}
        </div>

        {/* Name */}
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/20">
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Eye size={14} />
              <span className="text-xs font-bold">{views}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Views</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <ShoppingCart size={14} />
              <span className="text-xs font-bold">{orders}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Orders</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3">
          <button className="flex-1 px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
            Edit
          </button>
          <button className="flex-1 px-3 py-2 border-2 border-primary/30 text-primary rounded-lg font-semibold text-sm hover:bg-primary/5 transition-all">
            View
          </button>
        </div>
      </div>
    </div>
  )
}
