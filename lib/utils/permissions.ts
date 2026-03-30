import { User, Role, Permission, ModuleType, PermissionAction } from '@/lib/types/roles-permissions'

export const DEFAULT_PERMISSIONS: Permission[] = [
  // Users
  { id: 'view_users', module: 'users', action: 'view', description: 'View users' },
  { id: 'create_users', module: 'users', action: 'create', description: 'Create users' },
  { id: 'edit_users', module: 'users', action: 'edit', description: 'Edit users' },
  { id: 'delete_users', module: 'users', action: 'delete', description: 'Delete users' },
  // Roles
  { id: 'view_roles', module: 'roles', action: 'view', description: 'View roles' },
  { id: 'create_roles', module: 'roles', action: 'create', description: 'Create roles' },
  { id: 'edit_roles', module: 'roles', action: 'edit', description: 'Edit roles' },
  { id: 'delete_roles', module: 'roles', action: 'delete', description: 'Delete roles' },
  // Menu
  { id: 'view_menu', module: 'menu', action: 'view', description: 'View menu items' },
  { id: 'create_menu', module: 'menu', action: 'create', description: 'Create menu items' },
  { id: 'edit_menu', module: 'menu', action: 'edit', description: 'Edit menu items' },
  { id: 'delete_menu', module: 'menu', action: 'delete', description: 'Delete menu items' },
  // Banner
  { id: 'view_banner', module: 'banner', action: 'view', description: 'View banners' },
  { id: 'create_banner', module: 'banner', action: 'create', description: 'Create banners' },
  { id: 'edit_banner', module: 'banner', action: 'edit', description: 'Edit banners' },
  { id: 'delete_banner', module: 'banner', action: 'delete', description: 'Delete banners' },
  // Blog
  { id: 'view_blog', module: 'blog', action: 'view', description: 'View blog posts' },
  { id: 'create_blog', module: 'blog', action: 'create', description: 'Create blog posts' },
  { id: 'edit_blog', module: 'blog', action: 'edit', description: 'Edit blog posts' },
  { id: 'delete_blog', module: 'blog', action: 'delete', description: 'Delete blog posts' },
  // Branch
  { id: 'view_branch', module: 'branch', action: 'view', description: 'View branches' },
  { id: 'create_branch', module: 'branch', action: 'create', description: 'Create branches' },
  { id: 'edit_branch', module: 'branch', action: 'edit', description: 'Edit branches' },
  { id: 'delete_branch', module: 'branch', action: 'delete', description: 'Delete branches' },
  // Testimonial
  { id: 'view_testimonial', module: 'testimonial', action: 'view', description: 'View testimonials' },
  { id: 'create_testimonial', module: 'testimonial', action: 'create', description: 'Create testimonials' },
  { id: 'edit_testimonial', module: 'testimonial', action: 'edit', description: 'Edit testimonials' },
  { id: 'delete_testimonial', module: 'testimonial', action: 'delete', description: 'Delete testimonials' },
  // Franchise
  { id: 'view_franchise', module: 'franchise', action: 'view', description: 'View franchise inquiries' },
  { id: 'create_franchise', module: 'franchise', action: 'create', description: 'Create franchise inquiries' },
  { id: 'edit_franchise', module: 'franchise', action: 'edit', description: 'Edit franchise inquiries' },
  { id: 'delete_franchise', module: 'franchise', action: 'delete', description: 'Delete franchise inquiries' },
  // Contact
  { id: 'view_contact', module: 'contact', action: 'view', description: 'View contact messages' },
  // Promotion
  { id: 'view_promotion', module: 'promotion', action: 'view', description: 'View promotions' },
  { id: 'create_promotion', module: 'promotion', action: 'create', description: 'Create promotions' },
  { id: 'edit_promotion', module: 'promotion', action: 'edit', description: 'Edit promotions' },
  { id: 'delete_promotion', module: 'promotion', action: 'delete', description: 'Delete promotions' },
  // Settings
  { id: 'view_settings', module: 'settings', action: 'view', description: 'View settings' },
  { id: 'edit_settings', module: 'settings', action: 'edit', description: 'Edit settings' },
]

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_super_admin',
    name: 'Super Admin',
    type: 'super_admin',
    description: 'Full access to all features and settings',
    permissions: DEFAULT_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role_admin',
    name: 'Admin',
    type: 'admin',
    description: 'Can manage users, roles, and content',
    permissions: DEFAULT_PERMISSIONS.filter(
      (p) => !['create_roles', 'edit_roles', 'delete_roles'].includes(p.id) && p.id !== 'view_roles'
    ),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role_editor',
    name: 'Editor',
    type: 'editor',
    description: 'Can create and edit content',
    permissions: DEFAULT_PERMISSIONS.filter(
      (p) =>
        ['menu', 'banner', 'blog', 'testimonial', 'promotion'].some((m) => p.module === m) &&
        !p.id.includes('delete')
    ),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role_content_manager',
    name: 'Content Manager',
    type: 'content_manager',
    description: 'Can manage limited content',
    permissions: DEFAULT_PERMISSIONS.filter(
      (p) =>
        ['menu', 'banner'].some((m) => p.module === m) &&
        (p.action === 'view' || p.action === 'edit')
    ),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function hasPermission(user: User, module: ModuleType, action: PermissionAction): boolean {
  if (!user.isActive) return false

  // Super Admin has all permissions
  const superAdminRole = user.roles.find((r) => r.type === 'super_admin')
  if (superAdminRole) return true

  // Check if any of user's roles have the permission
  return user.roles.some((role) =>
    role.isActive &&
    role.permissions.some(
      (p) => p.module === module && p.action === action
    )
  )
}

export function canPerformAction(
  user: User,
  module: ModuleType,
  action: PermissionAction
): boolean {
  return hasPermission(user, module, action)
}

export function getPermissionsForRole(role: Role): string[] {
  return role.permissions.map((p) => p.id)
}

export function getModulePermissions(module: ModuleType): Permission[] {
  return DEFAULT_PERMISSIONS.filter((p) => p.module === module)
}

export function getAllModules(): ModuleType[] {
  const modules = new Set<ModuleType>()
  DEFAULT_PERMISSIONS.forEach((p) => modules.add(p.module))
  return Array.from(modules)
}
