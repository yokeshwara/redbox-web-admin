'use client'

import { Star, ThumbsUp, MessageCircle } from 'lucide-react'

interface ReviewCardProps {
  id: number
  author: string
  rating: number
  date: string
  title: string
  comment: string
  helpful?: number
  image?: string
}

export function ReviewCard({ id, author, rating, date, title, comment, helpful = 0, image }: ReviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-primary/3 rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {image ? (
            <img src={image} alt={author} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{author}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <h4 className="font-bold text-foreground">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{comment}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group">
          <ThumbsUp size={14} className="group-hover:fill-primary" />
          <span>Helpful ({helpful})</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle size={14} />
          <span>Reply</span>
        </button>
      </div>
    </div>
  )
}
