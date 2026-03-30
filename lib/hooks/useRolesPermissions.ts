import { useState, useEffect } from 'react'
import { User, Role } from '@/lib/types/roles-permissions'
import { DEFAULT_ROLES, DEFAULT_PERMISSIONS } from '@/lib/utils/permissions'

interface RolesPermissionsState {
  roles: Role[]
  users: User[]
  isLoading: boolean
}

export function useRolesPermissions() {
  const [state, setState] = useState<RolesPermissionsState>({
    roles: [],
    users: [],
    isLoading: true,
  })

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('redbox_roles_permissions')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setState({ roles: data.roles, users: data.users, isLoading: false })
      } catch {
        // Fallback to defaults
        const initialData = {
          roles: DEFAULT_ROLES,
          users: [
            {
              id: 'user_1',
              name: 'Super Admin User',
              email: 'admin@redbox.com',
              password: 'admin123',
              roles: [DEFAULT_ROLES[0]],
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        }
        localStorage.setItem('redbox_roles_permissions', JSON.stringify(initialData))
        setState({ roles: initialData.roles, users: initialData.users, isLoading: false })
      }
    } else {
      // Initialize with defaults
      const initialData = {
        roles: DEFAULT_ROLES,
        users: [
          {
            id: 'user_1',
            name: 'Super Admin User',
            email: 'admin@redbox.com',
            password: 'admin123',
            roles: [DEFAULT_ROLES[0]],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }
      localStorage.setItem('redbox_roles_permissions', JSON.stringify(initialData))
      setState({ roles: initialData.roles, users: initialData.users, isLoading: false })
    }
  }, [])

  const saveToLocalStorage = (roles: Role[], users: User[]) => {
    localStorage.setItem('redbox_roles_permissions', JSON.stringify({ roles, users }))
  }

  const addUser = (user: User) => {
    const updatedUsers = [...state.users, user]
    setState({ ...state, users: updatedUsers })
    saveToLocalStorage(state.roles, updatedUsers)
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = state.users.map((u) =>
      u.id === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
    )
    setState({ ...state, users: updatedUsers })
    saveToLocalStorage(state.roles, updatedUsers)
  }

  const deleteUser = (userId: string) => {
    const updatedUsers = state.users.filter((u) => u.id !== userId)
    setState({ ...state, users: updatedUsers })
    saveToLocalStorage(state.roles, updatedUsers)
  }

  const addRole = (role: Role) => {
    const updatedRoles = [...state.roles, role]
    setState({ ...state, roles: updatedRoles })
    saveToLocalStorage(updatedRoles, state.users)
  }

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    const updatedRoles = state.roles.map((r) =>
      r.id === roleId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    )
    setState({ ...state, roles: updatedRoles })
    saveToLocalStorage(updatedRoles, state.users)
  }

  const deleteRole = (roleId: string) => {
    const updatedRoles = state.roles.filter((r) => r.id !== roleId)
    const updatedUsers = state.users.map((u) => ({
      ...u,
      roles: u.roles.filter((r) => r.id !== roleId),
    }))
    setState({ ...state, roles: updatedRoles, users: updatedUsers })
    saveToLocalStorage(updatedRoles, updatedUsers)
  }

  const assignRolesToUser = (userId: string, roleIds: string[]) => {
    const updatedUsers = state.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          roles: state.roles.filter((r) => roleIds.includes(r.id)),
          updatedAt: new Date().toISOString(),
        }
      }
      return u
    })
    setState({ ...state, users: updatedUsers })
    saveToLocalStorage(state.roles, updatedUsers)
  }

  const assignPermissionsToRole = (roleId: string, permissionIds: string[]) => {
    const updatedRoles = state.roles.map((r) => {
      if (r.id === roleId) {
        return {
          ...r,
          permissions: DEFAULT_PERMISSIONS.filter((p) => permissionIds.includes(p.id)),
          updatedAt: new Date().toISOString(),
        }
      }
      return r
    })
    setState({ ...state, roles: updatedRoles })
    saveToLocalStorage(updatedRoles, state.users)
  }

  const addPermission = (permission: any) => {
    // Permissions are managed through DEFAULT_PERMISSIONS
    // This is a placeholder that can be extended if custom permissions storage is needed
    console.log('Permission added:', permission)
  }

  const updatePermission = (permissionId: string, updates: any) => {
    // Permissions are managed through DEFAULT_PERMISSIONS
    // This is a placeholder that can be extended if custom permissions storage is needed
    console.log('Permission updated:', permissionId, updates)
  }

  const deletePermission = (permissionId: string) => {
    // Permissions are managed through DEFAULT_PERMISSIONS
    // This is a placeholder that can be extended if custom permissions storage is needed
    console.log('Permission deleted:', permissionId)
  }

  const getUserById = (userId: string) => state.users.find((u) => u.id === userId)

  const getRoleById = (roleId: string) => state.roles.find((r) => r.id === roleId)

  return {
    roles: state.roles,
    users: state.users,
    permissions: DEFAULT_PERMISSIONS,
    isLoading: state.isLoading,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    assignRolesToUser,
    assignPermissionsToRole,
    addPermission,
    updatePermission,
    deletePermission,
    getUserById,
    getRoleById,
  }
}
