// API Configuration
const DEFAULT_API_BASE_URL = 'https://theredbox-admin-python-xxre.onrender.com'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || DEFAULT_API_BASE_URL

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/token',

  // Branches
  BRANCHES_LIST: '/api/branches/list/',
  BRANCHES_CREATE: '/api/branches/create/',
  BRANCHES_GET: (id: string) => `/api/branches/${id}/`,
  BRANCHES_UPDATE: (id: string) => `/api/branches/${id}/update/`,
  BRANCHES_DELETE: (id: string) => `/api/branches/${id}/delete/`,
  BRANCH_GALLERY_LIST: (branchId: string) => `/api/branches/${branchId}/gallery/`,
  BRANCH_GALLERY_UPLOAD: (branchId: string) => `/api/branches/${branchId}/gallery/upload/`,
  BRANCH_GALLERY_DELETE: (branchId: string, imageId: string) => `/api/branches/${branchId}/gallery/${imageId}/delete/`,

  // Franchises
  FRANCHISES_LIST: '/api/franchise/list/',
  FRANCHISES_CREATE: '/api/franchise/create/',
  FRANCHISES_GET: (id: string) => `/api/franchise/${id}/`,
  FRANCHISES_UPDATE: (id: string) => `/api/franchise/${id}/update/`,
  FRANCHISES_DELETE: (id: string) => `/api/franchise/${id}/delete/`,
  FRANCHISES_STATS: '/api/franchise/stats/',
  CAREERS_LIST: '/api/franchise/career/list/',
  CAREERS_GET: (id: string) => `/api/franchise/career/${id}/`,
  CAREERS_UPDATE: (id: string) => `/api/franchise/career/${id}/update/`,
  CAREERS_DELETE: (id: string) => `/api/franchise/career/${id}/delete/`,

  // Branch Facilities
  BRANCH_FACILITIES_LIST: '/api/branches/facilities/',
  BRANCH_FACILITIES_CREATE: '/api/branches/facilities/create/',
  BRANCH_FACILITIES_GET: (id: string) => `/api/branches/facilities/${id}/`,
  BRANCH_FACILITIES_UPDATE: (id: string) => `/api/branches/facilities/${id}/update/`,
  BRANCH_FACILITIES_DELETE: (id: string) => `/api/branches/facilities/${id}/delete/`,

  // Delivery Platforms
  DELIVERY_PLATFORMS_LIST: '/api/branches/delivery-platform/list',
  DELIVERY_PLATFORMS_CREATE: '/api/branches/delivery-platform/create',
  DELIVERY_PLATFORMS_GET: (id: string) => `/api/branches/delivery-platform/${id}/`,
  DELIVERY_PLATFORMS_UPDATE: (id: string) => `/api/branches/delivery-platform/${id}/update/`,
  DELIVERY_PLATFORMS_DELETE: (id: string) => `/api/branches/delivery-platform/${id}/delete/`,

  // Menu Categories
  MENU_CATEGORIES_LIST: '/api/menu/categories/',
  MENU_CATEGORIES_CREATE: '/api/menu/categories/create/',
  MENU_CATEGORIES_GET: (id: string) => `/api/menu/categories/${id}/`,
  MENU_CATEGORIES_UPDATE: (id: string) => `/api/menu/categories/${id}/update/`,
  MENU_CATEGORIES_DELETE: (id: string) => `/api/menu/categories/${id}/delete/`,

  // Menu Items
  MENU_ITEMS_LIST: '/api/menu/list/',
  MENU_ITEMS_CREATE: '/api/menu/create/',
  MENU_ITEMS_GET: (id: string) => `/api/menu/${id}/`,
  MENU_ITEMS_UPDATE: (id: string) => `/api/menu/${id}/update/`,
  MENU_ITEMS_DELETE: (id: string) => `/api/menu/${id}/delete/`,

  // Menu Media
  MENU_MEDIA_UPLOAD: (id: string) => `/api/menu/menu-items/${id}/media`,
  MENU_MEDIA_LIST: (id: string) => `/api/menu/menu-items/${id}/media-list`,
  MENU_MEDIA_UPDATE: (id: string) => `/api/menu/menu-items/media/${id}/update`,
  MENU_MEDIA_DELETE: (id: string) => `/api/menu/menu-items/media/${id}/delete`,
  MENU_MEDIA_REORDER: '/api/menu/menu-items/media/reorder',

  // Menu Tags
  MENU_TAGS_LIST: '/api/menu/tags/',
  MENU_TAGS_CREATE: '/api/menu/tags/create/',
  MENU_TAGS_GET: (id: string) => `/api/menu/tags/${id}/`,
  MENU_TAGS_UPDATE: (id: string) => `/api/menu/tags/${id}/update/`,
  MENU_TAGS_DELETE: (id: string) => `/api/menu/tags/${id}/delete/`,

  // Menu Addons
  MENU_ADDONS_LIST: '/api/menu/addons/list/',
  MENU_ADDONS_CREATE: '/api/menu/addons/create/',
  MENU_ADDONS_GET: (id: string) => `/api/menu/addons/${id}/`,
  MENU_ADDONS_UPDATE: (id: string) => `/api/menu/addons/${id}/update/`,
  MENU_ADDONS_DELETE: (id: string) => `/api/menu/addons/${id}/delete/`,

  // Menu Addon Categories
  MENU_ADDON_CATEGORIES_LIST: '/api/menu/addon-category/list/',
  MENU_ADDON_CATEGORIES_CREATE: '/api/menu/addon-category/create/',
  MENU_ADDON_CATEGORIES_GET: (id: string) => `/api/menu/addon-category/${id}/`,
  MENU_ADDON_CATEGORIES_UPDATE: (id: string) => `/api/menu/addon-category/${id}/update/`,
  MENU_ADDON_CATEGORIES_DELETE: (id: string) => `/api/menu/addon-category/${id}/delete/`,

  // Branch Reviews
  BRANCH_REVIEWS_LIST: '/api/branches/reviews/',
  BRANCH_REVIEWS_CREATE: '/api/branches/reviews/create/',
  BRANCH_REVIEWS_GET: (id: string) => `/api/branches/reviews/${id}/`,
  BRANCH_REVIEWS_UPDATE: (id: string) => `/api/branches/reviews/${id}/update/`,
  BRANCH_REVIEWS_DELETE: (id: string) => `/api/branches/reviews/${id}/delete/`,

  // Blog Categories
  BLOG_CATEGORIES_LIST: '/api/content/blog-categories/',
  BLOG_CATEGORIES_CREATE: '/api/content/blog-categories/create/',
  BLOG_CATEGORIES_GET: (id: string) => `/api/content/blog-categories/${id}/`,
  BLOG_CATEGORIES_UPDATE: (id: string) => `/api/content/blog-categories/${id}/update/`,
  BLOG_CATEGORIES_DELETE: (id: string) => `/api/content/blog-categories/${id}/delete/`,

  // Blog Posts
  BLOG_POSTS_LIST: '/api/content/blogs/',
  BLOG_POSTS_CREATE: '/api/content/blogs/create/',
  BLOG_POSTS_GET: (id: string) => `/api/content/blogs/${id}/`,
  BLOG_POSTS_UPDATE: (id: string) => `/api/content/blogs/${id}/update/`,
  BLOG_POSTS_DELETE: (id: string) => `/api/content/blogs/${id}/delete/`,

  // Blog Tags
  BLOG_TAGS_LIST: '/api/content/blog-tags/',
  BLOG_TAGS_CREATE: '/api/content/blog-tags/create/',
  BLOG_TAGS_GET: (id: string) => `/api/content/blog-tags/${id}/`,
  BLOG_TAGS_UPDATE: (id: string) => `/api/content/blog-tags/${id}/update/`,
  BLOG_TAGS_DELETE: (id: string) => `/api/content/blog-tags/${id}/delete/`,

  // Media Library
  MEDIA_UPLOAD: '/api/content/media/upload/',
  MEDIA_LIST: '/api/content/media/',
  MEDIA_GET: (id: string) => `/api/content/media/${id}/`,
  MEDIA_UPDATE: (id: string) => `/api/content/media/${id}/update/`,
  MEDIA_DELETE: (id: string) => `/api/content/media/${id}/delete/`,

  // Contact Enquiries
  CONTACT_ENQUIRIES_LIST: '/api/contact/list/',
  CONTACT_ENQUIRIES_GET: (id: string) => `/api/contact/${id}/`,
  CONTACT_ENQUIRIES_UPDATE: (id: string) => `/api/contact/${id}/update/`,
  CONTACT_ENQUIRIES_DELETE: (id: string) => `/api/contact/${id}/delete/`,
  CONTACT_ENQUIRIES_ASSIGN: (id: string) => `/api/contact/contact-enquiries/${id}/assign/`,
  CONTACT_ENQUIRIES_NOTES: (id: string) => `/api/contact/contact-enquiries/${id}/notes/`,

  // Franchise Reviews
  FRANCHISE_REVIEWS_LIST: '/api/franchise/reviews/',
  FRANCHISE_REVIEWS_UPDATE: (id: string) => `/api/franchise/reviews/${id}/update/`,

  // Marketing - Promotions
  PROMOTIONS_LIST: '/api/marketing/promotions/',
  PROMOTIONS_CREATE: '/api/marketing/promotions/create/',
  PROMOTIONS_GET: (id: string) => `/api/marketing/promotions/${id}/`,
  PROMOTIONS_UPDATE: (id: string) => `/api/marketing/promotions/${id}/update/`,
  PROMOTIONS_DELETE: (id: string) => `/api/marketing/promotions/${id}/delete/`,

  // Marketing - Campaigns
  CAMPAIGNS_LIST: '/api/marketing/campaigns/',
  CAMPAIGNS_CREATE: '/api/marketing/campaigns/create/',
  CAMPAIGNS_GET: (id: string) => `/api/marketing/campaigns/${id}/`,
  CAMPAIGNS_UPDATE: (id: string) => `/api/marketing/campaigns/${id}/update/`,
  CAMPAIGNS_DELETE: (id: string) => `/api/marketing/campaigns/${id}/delete/`,

  // Marketing - Offers
  OFFERS_LIST: '/api/marketing/offers/',
  OFFERS_CREATE: '/api/marketing/offers/create/',
  OFFERS_GET: (id: string) => `/api/marketing/offers/${id}/`,
  OFFERS_UPDATE: (id: string) => `/api/marketing/offers/${id}/update/`,
  OFFERS_DELETE: (id: string) => `/api/marketing/offers/${id}/delete/`,

  // CMS - Homepage Sections
  HOMEPAGE_SECTIONS_LIST: '/api/cms/sections',
  HOMEPAGE_SECTIONS_CREATE: '/api/cms/sections/create',
  HOMEPAGE_SECTIONS_GET: (id: string) => `/api/cms/sections?id=${id}`,
  HOMEPAGE_SECTIONS_UPDATE: (id: string) => `/api/cms/sections/${id}/update`,
  HOMEPAGE_SECTIONS_DELETE: (id: string) => `/api/cms/sections/${id}/delete`,
  HOMEPAGE_SECTIONS_REORDER: '/api/cms/sections/reorder',
  HOMEPAGE_SECTIONS_TOGGLE: (id: string) => `/api/cms/sections/${id}/toggle`,

  // CMS - Banners
  BANNERS_LIST: '/api/cms/banners',
  BANNERS_CREATE: '/api/cms/banners/create',
  BANNERS_GET: (id: string) => `/api/cms/banners/${id}/`,
  BANNERS_UPDATE: (id: string) => `/api/cms/banners/${id}/update/`,
  BANNERS_DELETE: (id: string) => `/api/cms/banners/${id}/delete`,
  BANNERS_ACTIVATE: (id: string) => `/api/cms/banners/${id}/activate`,

  // CMS - Featured Dishes
  FEATURED_DISHES_LIST: '/api/cms/featured-dishes',
  FEATURED_DISHES_CREATE: '/api/cms/featured-dishes/create',
  FEATURED_DISHES_GET: (id: string) => `/api/cms/featured-dishes?id=${id}`,
  FEATURED_DISHES_UPDATE: (id: string) => `/api/cms/featured-dishes/${id}/update/`,
  FEATURED_DISHES_DELETE: (id: string) => `/api/cms/featured-dishes/${id}/delete`,

  // CMS - Testimonials
  TESTIMONIALS_LIST: '/api/cms/testimonials',
  TESTIMONIALS_GET: (id: string) => `/api/cms/testimonials/${id}/`,
  TESTIMONIALS_CREATE: '/api/cms/testimonials/create',
  TESTIMONIALS_UPDATE: (id: string) => `/api/cms/testimonials/${id}/update`,
  TESTIMONIALS_APPROVE: (id: string) => `/api/cms/testimonials/${id}/approve`,
  TESTIMONIALS_DELETE: (id: string) => `/api/cms/testimonials/${id}/delete`,

  // Settings - Website Settings
  WEBSITE_SETTINGS_LIST: '/api/settings/list/',
  WEBSITE_SETTINGS_UPDATE: '/api/settings/list/',

  // Settings - SEO
  SEO_LIST: '/api/settings/seo',
  SEO_CREATE: '/api/settings/seo/create',
  SEO_GET: (id: string) => `/api/settings/seo/${id}/`,
  SEO_UPDATE: (id: string) => `/api/settings/seo/${id}/update`,
  SEO_DELETE: (id: string) => `/api/settings/seo/${id}/delete`,

  // Settings - Display
  DISPLAY_SETTINGS: '/api/settings/display/',

  // Accounts - Roles
  ROLES_LIST: '/api/accounts/roles',
  ROLES_CREATE: '/api/accounts/roles/create',
  ROLES_GET: (id: string) => `/api/accounts/roles/${id}/`,
  ROLES_UPDATE: (id: string) => `/api/accounts/roles/${id}/update`,
  ROLES_DELETE: (id: string) => `/api/accounts/roles/${id}/delete`,

  // Accounts - Permissions
  PERMISSIONS_LIST: '/api/accounts/permissions',
  PERMISSIONS_CREATE: '/api/accounts/permissions/create',
  PERMISSIONS_GET: (id: string) => `/api/accounts/permissions/${id}/`,
  PERMISSIONS_UPDATE: (id: string) => `/api/accounts/permissions/${id}/update`,
  PERMISSIONS_DELETE: (id: string) => `/api/accounts/permissions/${id}/delete`,

  // Accounts - Role Permissions Assignment
  ROLE_ASSIGN_PERMISSIONS: '/api/accounts/roles/assign-permissions',

  // Accounts - Users
  USERS_LIST: '/api/accounts/list/',
  USERS_CREATE: '/api/accounts/user-create/',
  USERS_GET: (id: string) => `/api/accounts/user/${id}/`,
  USERS_UPDATE: (id: string) => `/api/accounts/user/${id}/update/`,
  USERS_DELETE: (id: string) => `/api/accounts/user/${id}/delete/`,

  // Events Management
  EVENTS_LIST: '/api/events/admin/',
  EVENTS_CREATE: '/api/events/admin/create',
  EVENTS_GET: (id: string) => `/api/events/admin/${id}/`,
  EVENTS_UPDATE: (id: string) => `/api/events/admin/${id}/update/`,
  EVENTS_DELETE: (id: string) => `/api/events/admin/${id}/delete`,

  // Event Bookings
  EVENT_BOOKINGS_LIST: '/api/events/admin/event-bookings',
  EVENT_BOOKINGS_STATUS: (id: string) => `/api/events/admin/event-bookings/${id}/status`,

  // Reservations
  RESERVATIONS_LIST: '/api/events/admin/reservations',
  RESERVATIONS_STATUS: (id: string) => `/api/events/admin/reservations/${id}/status`,

  // Catering Requests
  CATERING_REQUESTS_LIST: '/api/events/admin/catering',
  CATERING_REQUESTS_GET: (id: string) => `/api/events/admin/catering/${id}`,
  CATERING_REQUESTS_UPDATE: (id: string) => `/api/events/admin/catering/${id}/update`,
  CATERING_REQUESTS_DELETE: (id: string) => `/api/events/admin/catering/${id}/delete`,
  CATERING_REQUESTS_STATUS: (id: string) => `/api/events/admin/catering/${id}/status`,

  // Dashboard
  DASHBOARD_DATA: '/api/dashboard/',

  // Profile Management
  PROFILE_GET: '/api/accounts/profile/',
  PROFILE_UPDATE: '/api/accounts/profile/',

  // Logo & Settings
  LOGO_UPDATE: '/api/settings/admin/logo/update',
}

// Helper to get authorization header
export const getAuthHeader = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
})

// Helper to make API requests
export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any,
  token?: string
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}
