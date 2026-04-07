'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/lib/auth'
import {
  LayoutDashboard, Store, UtensilsCrossed, Briefcase, FileText, Users, Settings, LogOut, Menu, X,
  Edit2, MapPin, Image as ImageIcon, Bell, BarChart3, Lock, LogIn, Zap, Star, Calendar, BookOpen, Tag, Clock
} from 'lucide-react'

interface NavItem {
  href?: string
  label: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  submenu?: NavItem[]
}

interface BrandingData {
  logo: string
  title: string
  subtitle: string
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },

  // CMS Section
  {
    label: 'CMS',
    icon: <FileText size={20} />,
    submenu: [
      { href: '/admin/homepage-sections', label: 'Homepage Manager', icon: <ImageIcon size={16} /> },
      { href: '/admin/content', label: 'Banners', icon: <ImageIcon size={16} /> },
      { href: '/admin/featured-dishes', label: 'Featured Dishes', icon: <UtensilsCrossed size={16} /> },
      { href: '/admin/testimonials', label: 'Testimonials', icon: <Star size={16} /> },
    ]
  },

  // Restaurant Management
  {
    label: 'Restaurant',
    icon: <Store size={20} />,
    submenu: [
      { href: '/admin/branches', label: 'Branches', icon: <Store size={16} /> },
      { href: '/admin/facilities', label: 'Branch Facilities', icon: <Zap size={16} /> },
      { href: '/admin/branch-reviews', label: 'Branch Reviews', icon: <Star size={16} /> },
      // { href: '/admin/delivery-platforms', label: 'Delivery Platforms', icon: <Zap size={16} /> },
      // { href: '/admin/menu-categories', label: 'Menu Categories', icon: <Tag size={16} /> },
      // { href: '/admin/menu', label: 'Menu Items', icon: <UtensilsCrossed size={16} /> },
      // { href: '/admin/menu-tags', label: 'Menu Tags', icon: <Tag size={16} /> },
      // { href: '/admin/menu-addons', label: 'Menu Add-ons', icon: <Zap size={16} /> },
    ]
  },

  // Bookings
  {
    label: 'Bookings',
    icon: <Calendar size={20} />,
    submenu: [
      // { href: '/admin/reservations', label: 'Reservations', icon: <Calendar size={16} /> },
      // { href: '/admin/reservation-history', label: 'Status History', icon: <Clock size={16} /> },
      // { href: '/admin/events', label: 'Events', icon: <Calendar size={16} /> },
      // { href: '/admin/event-bookings', label: 'Event Bookings', icon: <Calendar size={16} /> },
      // { href: '/admin/reservations-events', label: 'Event Reservations', icon: <Calendar size={16} /> },
      { href: '/admin/catering-requests-events', label: 'Event Catering', icon: <Briefcase size={16} /> },
    ]
  },

  // Content
  // {
  //   label: 'Content',
  //   icon: <BookOpen size={20} />,
  //   submenu: [
  //     { href: '/admin/blogs', label: 'Blog Posts', icon: <BookOpen size={16} /> },
  //     { href: '/admin/blog-categories', label: 'Blog Categories', icon: <Tag size={16} /> },
  //     { href: '/admin/blog-tags', label: 'Blog Tags', icon: <Tag size={16} /> },
  //     { href: '/admin/media-library', label: 'Media Library', icon: <ImageIcon size={16} /> },
  //   ]
  // },

  // CRM
  {
    label: 'CRM',
    icon: <Users size={20} />,
    submenu: [
      { href: '/admin/contact-enquiry', label: 'Contact Inquiries', icon: <Bell size={16} />, badge: '3', badgeColor: 'bg-orange-500' },
      { href: '/admin/franchises', label: 'Franchise Enquiries', icon: <Briefcase size={16} />, badge: '5', badgeColor: 'bg-orange-500' },
      { href: '/admin/careers', label: 'Career Applications', icon: <Briefcase size={16} /> },
      // { href: '/admin/customer-reviews', label: 'Customer Reviews', icon: <Star size={16} /> },
    ]
  },

  // Marketing
  // {
  //   label: 'Marketing',
  //   icon: <Tag size={20} />,
  //   submenu: [
  //     { href: '/admin/promotions', label: 'Promotions', icon: <Tag size={16} /> },
  //     { href: '/admin/campaigns', label: 'Homepage Campaigns', icon: <Zap size={16} /> },
  //     { href: '/admin/featured-offers', label: 'Featured Offers', icon: <Star size={16} /> },
  //   ]
  // },

  // System
  // {
  //   label: 'System',
  //   icon: <Settings size={20} />,
  //   submenu: [
  //     { href: '/admin/users-roles', label: 'Users & Roles', icon: <Users size={16} /> },
  //     { href: '/admin/seo-settings', label: 'SEO Settings', icon: <Settings size={16} /> },
  //     { href: '/admin/website-settings', label: 'Website Settings', icon: <Settings size={16} /> },
  //     { href: '/admin/audit-logs', label: 'Audit Logs', icon: <Clock size={16} /> },
  //     { href: '/admin/notifications', label: 'Notifications', icon: <Bell size={16} /> },
  //   ]
  // },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showBrandingModal, setShowBrandingModal] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const [branding, setBranding] = useState<BrandingData>({
    logo: '/red-box-logo.png',
    title: 'RedBox',
    subtitle: 'Admin',
  })
  const pathname = usePathname()

  const toggleMenu = (label: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedMenus(newExpanded)
  }

  const isMenuExpanded = (label: string) => expandedMenus.has(label)
  const isSubmenuActive = (submenu?: NavItem[]) => {
    if (!submenu) return false
    return submenu.some(item => item.href && pathname.startsWith(item.href))
  }

  useEffect(() => {
    const stored = localStorage.getItem('sidebarBranding')
    if (stored) {
      try {
        setBranding(JSON.parse(stored))
      } catch {
        // Keep default if parse fails
      }
    }
  }, [])

  const handleLogout = () => {
    logoutUser('/admin/login')
  }

  const closeSidebar = () => setIsOpen(false)

  const handleBrandingUpdate = (newBranding: BrandingData) => {
    setBranding(newBranding)
    localStorage.setItem('sidebarBranding', JSON.stringify(newBranding))
    setShowBrandingModal(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden fixed top-4 right-4 z-50 p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-white via-primary/3 to-gray-50 border-r-2 border-primary/20 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
        {/* Logo Section */}
        <div className="p-6 border-b-2 border-primary/30 bg-gradient-to-r from-white to-primary/10">
          <div className="flex items-center gap-3 justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                <Image
                  src={branding.logo}
                  alt={branding.title}
                  width={50}
                  height={50}
                  className="object-contain w-auto h-auto"
                  loading="eager"
                />
              </div>
              <div>
                <p className="text-sm text-foreground font-bold">{branding.title}</p>
                <p className="text-xs text-primary font-semibold">{branding.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setShowBrandingModal(true)}
              className="p-2 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              title="Edit branding"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-gray-500 px-4 py-2 uppercase tracking-wide">Menu</div>
          {navItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = isMenuExpanded(item.label)
            const submenuIsActive = isSubmenuActive(item.submenu)
            const isDirectActive = item.href ? pathname.startsWith(item.href) : false

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${submenuIsActive
                        ? 'bg-gradient-to-r from-primary via-primary/95 to-secondary text-white shadow-lg font-bold'
                        : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                      }`}
                  >
                    <span className={`flex-shrink-0 ${submenuIsActive ? 'text-white' : 'text-gray-600 group-hover:text-primary'}`}>{item.icon}</span>
                    <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                    <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
                      {item.submenu.map((subitem) => {
                        const isSubActive = subitem.href ? pathname.startsWith(subitem.href) : false
                        return (
                          <Link
                            key={subitem.href}
                            href={subitem.href || '#'}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group ${isSubActive
                                ? 'bg-primary/20 text-primary font-bold'
                                : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                              }`}
                          >
                            <span className="flex-shrink-0">{subitem.icon}</span>
                            <span className="truncate flex-1">{subitem.label}</span>
                            {subitem.badge && (
                              <span className={`px-1.5 py-0.5 rounded-lg text-xs font-bold text-white ${subitem.badgeColor || 'bg-primary'}`}>
                                {subitem.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            } else {
              return (
                <Link
                  key={item.href}
                  href={item.href || '#'}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap group ${isDirectActive
                    ? 'bg-gradient-to-r from-primary via-primary/95 to-secondary text-white shadow-lg font-bold'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                    }`}
                >
                  <span className={`flex-shrink-0 ${isDirectActive ? 'text-white' : 'text-gray-600 group-hover:text-primary'}`}>{item.icon}</span>
                  <span className="font-medium truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${item.badgeColor || 'bg-gradient-to-r from-primary to-secondary'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            }
          })}
        </nav>

        {/* Logout Section */}
        {/* <div className="p-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-primary/20 hover:text-primary font-bold transition-colors whitespace-nowrap"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div> */}
      </aside>

      {/* Branding Modal */}
      {showBrandingModal && <BrandingModal branding={branding} onUpdate={handleBrandingUpdate} onClose={() => setShowBrandingModal(false)} />}
    </>
  )
}

function BrandingModal({ branding, onUpdate, onClose }: { branding: BrandingData; onUpdate: (data: BrandingData) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<BrandingData>(branding)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Sidebar Branding</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Logo URL</label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="/red-box-logo.png"
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="RedBox"
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Admin"
              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary text-gray-900"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
