'use client'

/**
 * Style Guide Component - Showcases Rich UI Design System
 * 
 * This component demonstrates all the design improvements including:
 * - Color system (Red & White theme)
 * - Typography hierarchy
 * - Component variations
 * - Interactive states
 * - Responsive behavior
 */

import { Zap, MapPin, Phone, Mail, Clock, Star, TrendingUp, Users, FileText } from 'lucide-react'

export function StyleGuide() {
  return (
    <div className="space-y-12 p-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">🎨 Rich UI Design System</h1>
        <p className="text-lg text-muted-foreground">Red & White Professional Theme - Inspired by Swiggy & Zomato</p>
      </div>

      {/* Color Palette */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap size={28} className="text-primary" />
          Color System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Red */}
          <div className="space-y-3">
            <div className="h-32 bg-primary rounded-xl shadow-lg hover:shadow-xl transition-all"></div>
            <div>
              <p className="font-bold text-foreground">Primary Red</p>
              <p className="text-sm text-muted-foreground">#EE3333</p>
              <p className="text-xs text-muted-foreground mt-2">CTAs, highlights, active states</p>
            </div>
          </div>

          {/* White */}
          <div className="space-y-3">
            <div className="h-32 bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all"></div>
            <div>
              <p className="font-bold text-foreground">Pure White</p>
              <p className="text-sm text-muted-foreground">#FFFFFF</p>
              <p className="text-xs text-muted-foreground mt-2">Cards, backgrounds, inputs</p>
            </div>
          </div>

          {/* Success Green */}
          <div className="space-y-3">
            <div className="h-32 bg-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all"></div>
            <div>
              <p className="font-bold text-foreground">Success Green</p>
              <p className="text-sm text-muted-foreground">#22C55E</p>
              <p className="text-xs text-muted-foreground mt-2">Active, approved, success</p>
            </div>
          </div>

          {/* Danger Red */}
          <div className="space-y-3">
            <div className="h-32 bg-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all"></div>
            <div>
              <p className="font-bold text-foreground">Danger Red</p>
              <p className="text-sm text-muted-foreground">#DC2626</p>
              <p className="text-xs text-muted-foreground mt-2">Inactive, error, delete</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText size={28} className="text-primary" />
          Typography System
        </h2>
        <div className="space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl border border-primary/10">
          <div>
            <h3 className="text-4xl font-bold text-foreground mb-2">Display Heading</h3>
            <p className="text-sm text-muted-foreground">For page titles and major sections</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Section Heading</h3>
            <p className="text-sm text-muted-foreground">For subsections and categories</p>
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground mb-1">Subsection Title</p>
            <p className="text-sm text-muted-foreground">For content organization</p>
          </div>

          <div>
            <p className="text-base font-medium text-foreground mb-1">Body Text with Medium Weight</p>
            <p className="text-sm text-muted-foreground">Regular content for readability</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Small Text - Caption or Helper</p>
            <p className="text-xs text-muted-foreground">Minimal visual importance</p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users size={28} className="text-primary" />
          Component Variations
        </h2>

        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">+ Add New</button>
            <button className="btn-secondary">📁 Browse</button>
            <button className="px-6 py-2.5 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-all">
              👁️ View Details
            </button>
            <button className="px-6 py-2.5 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Status Badges</h3>
          <div className="flex flex-wrap gap-4">
            <span className="badge-success">✓ Active</span>
            <span className="badge-danger">✕ Inactive</span>
            <span className="badge-warning">⏳ Pending</span>
            <span className="badge-primary">⭐ Featured</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">ℹ️ Info</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">★ Bestseller</span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Input Fields</h3>
          <div className="space-y-3 max-w-md">
            <div>
              <label className="input-label">Branch Name</label>
              <input type="text" placeholder="Enter branch name" className="input-field" />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" placeholder="branch@example.com" className="input-field" />
            </div>
            <div>
              <label className="input-label">Select Status</label>
              <select className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className="input-label">Description</label>
              <textarea placeholder="Enter description..." className="input-field resize-none" rows={3}></textarea>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp size={28} className="text-primary" />
          Card Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rich Card Example 1 */}
          <div className="modal-card p-6 space-y-4">
            <div className="card-header">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Branch Information</h3>
                <p className="text-sm text-muted-foreground">Manage location details</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-bold text-foreground">Downtown Mumbai</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="badge-success">✓ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-foreground">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rich Card Example 2 */}
          <div className="modal-card p-6 space-y-4">
            <div className="card-header">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Franchise Details</h3>
                <p className="text-sm text-muted-foreground">Track opportunities</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Investment:</span>
                <span className="font-bold text-foreground">₹50L - 1Cr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lead Score:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '85%' }} />
                  </div>
                  <span className="font-bold text-foreground">85</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="badge-warning">⏳ Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap size={28} className="text-primary" />
          Icon Integration
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: MapPin, label: 'Location' },
            { icon: Phone, label: 'Contact' },
            { icon: Mail, label: 'Email' },
            { icon: Clock, label: 'Schedule' },
            { icon: Star, label: 'Rating' },
            { icon: TrendingUp, label: 'Growth' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:shadow-md transition-all">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon size={24} className="text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground text-center">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary p-8 rounded-2xl text-white shadow-xl space-y-4">
        <h2 className="text-2xl font-bold">✨ Design System Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">🎨 Visual Foundation</h3>
            <ul className="text-sm space-y-1 text-white/90">
              <li>✓ Red & White color scheme</li>
              <li>✓ Inter typography family</li>
              <li>✓ 12px border radius</li>
              <li>✓ Smooth animations (200-300ms)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">🎯 Component Features</h3>
            <ul className="text-sm space-y-1 text-white/90">
              <li>✓ Gradient headers & buttons</li>
              <li>✓ Rich input styling</li>
              <li>✓ Interactive hover states</li>
              <li>✓ Responsive design</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
