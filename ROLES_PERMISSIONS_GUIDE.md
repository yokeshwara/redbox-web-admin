# Roles & Permissions Management System

## Overview

Redbox Admin now has a complete **Roles & Permissions Management System** based on the MCC admin panel architecture. This system allows super admins to manage user accounts, create custom roles, and assign granular permissions to control who can access what features.

## Architecture

### Three-Tier System

1. **Users** - Individual admin accounts with email and password
2. **Roles** - Groups of permissions that define what users can do
3. **Permissions** - Specific actions (view, create, edit, delete) for each module

### Default Role Hierarchy

| Role | Level | Description | Use Case |
|------|-------|-------------|----------|
| **Super Admin** | 5 | Full access to everything including user/role management | System administrator |
| **Admin** | 4 | Can manage most content and operations except roles | Restaurant manager |
| **Editor** | 3 | Can create and edit content (menu, blog, banners) | Content creator |
| **Content Manager** | 2 | Limited to menu and banner management only | Junior editor |

## Key Features

### User Management (`/admin/users-roles/users`)

- **Create Users**: Add new admin users with email and password
- **Assign Roles**: Select one or multiple roles for each user
- **Manage Users**: Edit, activate/deactivate, or delete users
- **Search**: Filter users by name or email
- **User Status**: Active/Inactive toggle for quick access control

### Role Management (`/admin/users-roles/roles`)

- **Create Custom Roles**: Define new roles beyond the defaults
- **Manage Permissions**: Assign specific permissions to roles
- **View Permissions**: See how many permissions each role has
- **Role Status**: Activate/deactivate roles
- **Module-Based Organization**: Permissions grouped by feature (Users, Menu, Banner, Blog, etc.)

### Permissions System

Permissions are organized by **module** and **action**:

```
Module: users, roles, menu, banner, blog, branch, testimonial, franchise, contact, promotion, settings

Actions for each module:
- view: Can see/read the module
- create: Can add new items
- edit: Can modify existing items
- delete: Can remove items
```

#### Available Modules

| Module | Permissions | Usage |
|--------|-------------|-------|
| **Users** | view, create, edit, delete | Manage admin users |
| **Roles** | view, create, edit, delete | Manage roles and permissions |
| **Menu** | view, create, edit, delete | Manage menu items and categories |
| **Banner** | view, create, edit, delete | Create and manage banners |
| **Blog** | view, create, edit, delete | Write and manage blog posts |
| **Branch** | view, create, edit, delete | Manage restaurant locations |
| **Testimonial** | view, create, edit, delete | Manage customer testimonials |
| **Franchise** | view, create, edit, delete | Handle franchise inquiries |
| **Contact** | view | View contact messages |
| **Promotion** | view, create, edit, delete | Create promotional campaigns |
| **Settings** | view, edit | Modify system settings |

## Data Storage

All roles, permissions, and user data are stored in **localStorage** under the key `redbox_roles_permissions` as JSON. This allows:

- Persistent data across page refreshes
- No backend required for development
- Easy export/import of role configurations

### Default Data Structure

```typescript
{
  roles: [
    {
      id: "role_super_admin",
      name: "Super Admin",
      type: "super_admin",
      description: "Full access to all features and settings",
      permissions: [...all permissions...],
      isActive: true,
      createdAt: "ISO timestamp",
      updatedAt: "ISO timestamp"
    },
    // ... more roles
  ],
  users: [
    {
      id: "user_1",
      name: "Super Admin User",
      email: "admin@redbox.com",
      password: "admin123",
      roles: [...role objects...],
      isActive: true,
      createdAt: "ISO timestamp",
      updatedAt: "ISO timestamp"
    },
    // ... more users
  ]
}
```

## How to Use

### Creating a New User

1. Go to **Admin Panel → Users & Roles → Users**
2. Click **Add User** button
3. Fill in:
   - **Full Name**: User's display name
   - **Email Address**: Login email
   - **Password**: Initial password
   - **Assign Roles**: Select one or more roles
4. Click **Create User**

**Note**: Users inherit all permissions from their assigned roles.

### Creating a Custom Role

1. Go to **Admin Panel → Users & Roles → Roles**
2. Click **Add Role** button
3. Enter:
   - **Role Name**: Descriptive name (e.g., "Social Media Manager")
   - **Description**: What this role can do
4. Click **Create Role**
5. Click the **Lock icon** to open permissions manager
6. Select specific permissions by:
   - Clicking individual permission checkboxes
   - Or clicking the module header checkbox to select all permissions in that module
7. Click **Save Permissions**

### Assigning Roles to Users

**Option 1: When Creating/Editing a User**
- Select roles in the "Assign Roles" section of the user form

**Option 2: Quick Assign from Users Table**
1. Find the user in the users table
2. Click the **"Assign Roles"** button
3. Check/uncheck role checkboxes
4. Click **Assign Selected Roles**

### Managing Permissions for a Role

1. Go to **Users & Roles → Roles**
2. Find the role and click the **Lock icon** (Manage Permissions)
3. Permissions are grouped by module
4. Check the module header to select all permissions in that module
5. Or individually select specific actions (view, create, edit, delete)
6. Click **Save Permissions**

## Technical Details

### File Structure

```
/lib/
  ├── types/roles-permissions.ts      # TypeScript interfaces
  ├── hooks/useRolesPermissions.ts    # Custom hook for data management
  └── utils/permissions.ts            # Permission logic and defaults

/app/admin/users-roles/
  ├── page.tsx                         # Main container
  ├── users/page.tsx                  # Users management page
  └── roles/page.tsx                  # Roles management page

/components/admin/
  ├── users-management/
  │   ├── users-table.tsx             # Display users
  │   ├── user-form.tsx               # Create/edit users
  │   └── user-roles-modal.tsx        # Assign roles to user
  └── roles-management/
      ├── roles-table.tsx             # Display roles
      ├── role-form.tsx               # Create/edit roles
      └── role-permissions-modal.tsx  # Assign permissions to role
```

### Custom Hook: `useRolesPermissions()`

```typescript
const {
  roles,                    // Array of all roles
  users,                    // Array of all users
  isLoading,               // Loading state
  addUser,                 // Create new user
  updateUser,              // Edit user
  deleteUser,              // Remove user
  addRole,                 // Create new role
  updateRole,              // Edit role
  deleteRole,              // Remove role
  assignRolesToUser,       // Assign roles to user
  assignPermissionsToRole, // Assign permissions to role
  getUserById,             // Get specific user
  getRoleById,             // Get specific role
} = useRolesPermissions()
```

### Utility Functions: `permissions.ts`

```typescript
// Check if user has a specific permission
hasPermission(user, 'menu', 'create')  // Returns boolean

// Get all permissions for a role
getPermissionsForRole(role)            // Returns permission IDs

// Get all permissions for a module
getModulePermissions('banner')         // Returns Permission array

// Get all available modules
getAllModules()                        // Returns ModuleType array
```

## Default Admin Credentials

When the system first loads, a default super admin user is created:

- **Email**: `admin@redbox.com`
- **Password**: `admin123`
- **Role**: Super Admin

**⚠️ Important**: Change this password immediately after first login!

## Security Considerations

1. **Authentication**: Basic email/password stored in localStorage
2. **Role-Based Access Control**: Check permissions before showing features
3. **Permission Inheritance**: Users get all permissions from their roles
4. **Super Admin Override**: Super Admin bypasses all permission checks

For production deployment:
- Migrate to a proper backend with database
- Use hashing for passwords (bcrypt, Argon2)
- Implement session management with HTTP-only cookies
- Add authentication/authorization middleware

## Troubleshooting

### Users not appearing
- Clear browser cache/localStorage
- Check browser console for errors
- Verify localStorage isn't disabled

### Can't assign permissions
- Make sure you're using a Super Admin account
- Check that the role is active

### Users losing roles
- localStorage might be clearing on browser close
- Check browser privacy settings

## API Integration (Future)

When moving to a backend, implement these endpoints:

```
GET    /api/admin/users           # List users
POST   /api/admin/users           # Create user
PUT    /api/admin/users/:id       # Update user
DELETE /api/admin/users/:id       # Delete user

GET    /api/admin/roles           # List roles
POST   /api/admin/roles           # Create role
PUT    /api/admin/roles/:id       # Update role
DELETE /api/admin/roles/:id       # Delete role

POST   /api/admin/users/:id/roles # Assign roles to user
PUT    /api/admin/roles/:id/permissions # Set role permissions
```

## Examples

### Give a user permission to manage menu items only

1. Create a new role called "Menu Manager"
2. In permissions, select only "Menu Management" module permissions
3. Assign that role to the user

### Create a content manager with limited editing ability

1. Create role "Limited Editor"
2. Select only: `view_menu`, `edit_menu`, `view_banner`, `edit_banner`
3. Assign to user

### Quickly deactivate a user

- Click the **Power icon** in the Users table
- User becomes inactive and can't log in

---

**Last Updated**: 2024
**System**: Redbox Admin Panel
**Version**: 1.0.0
