'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen } from 'lucide-react'

interface BlogFormModalProps {
  item?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function BlogFormModal({ item, onSubmit, onClose }: BlogFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Food',
    author: '',
    content: '',
    excerpt: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    status: 'Draft',
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const readTime = Math.ceil(formData.content.split(' ').length / 200)
    onSubmit({
      ...formData,
      readTime,
    })
  }

  const categories = ['Food', 'Nutrition', 'Events', 'Recipes', 'Tips & Tricks', 'Customer Stories']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {item ? 'Edit Blog Post' : 'Write Post'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Create and manage blog content</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Post Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <BookOpen size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Post Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Post Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FormInput
              label="Author Name *"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g., Chef Rahul, Nutritionist Sarah"
              required
            />

            <FormInput
              label="Excerpt *"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the post (one sentence)"
              textarea
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Post Content</h3>
            <FormInput
              label="Full Content *"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog post content here..."
              textarea
              required
            />
            <p className="text-sm text-muted-foreground">
              Read time: ~{Math.ceil(formData.content.split(' ').length / 200)} min
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Featured Image</h3>
            <FormInput
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="flex justify-center pt-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-48 h-32 rounded-lg object-cover border-2 border-primary/20"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Publication Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border-2 border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {item ? '✓ Update Post' : '+ Write Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 w-full sm:w-auto"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  textarea = false,
}: any) {
  return (
    <div className="form-group">
      <label className="input-label">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field resize-none"
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
        />
      )}
    </div>
  )
}
