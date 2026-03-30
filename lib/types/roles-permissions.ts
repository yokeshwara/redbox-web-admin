export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export type ModuleType =
  | 'users'
  | 'roles'
  | 'menu'
  | 'banner'
  | 'blog'
  | 'branch'
  | 'testimonial'
  | 'franchise'
  | 'contact'
  | 'promotion'
  | 'settings'

export interface Permission {
  id: string
  module: ModuleType
  action: PermissionAction
  description: string
}

export type RoleType = 'super_admin' | 'admin' | 'editor' | 'content_manager'

export interface Role {
  id: string
  name: string
  type: RoleType
  description: string
  permissions: Permission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  password?: string
  roles: Role[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RolePermissionMap {
  [roleId: string]: string[] // role id -> permission ids
}

export interface UserRoleMap {
  [userId: string]: string[] // user id -> role ids
}
