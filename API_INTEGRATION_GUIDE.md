# API Integration Guide - Menu Media Management

## Overview
This document outlines all integrated APIs for menu item media management in the admin dashboard.

## Menu Media APIs

### 1. Upload Media
**Endpoint:** `POST /api/menu/menu-items/{uuid:id}/media`

**Supported Media Types:**
- **Image Upload**
  - Format: `form-data`
  - Fields: `media_type=image`, `image=file`, `is_primary=true` (optional)
  
- **Ingredient Image**
  - Format: `form-data`
  - Fields: `media_type=ingredient`, `image=file`
  
- **Video URL**
  - Format: `JSON`
  - Payload: `{"media_type":"video","video_url":"https://youtube.com/shorts/abc123"}`

**Implementation Location:** `/lib/api/menu-media.ts` - `uploadMedia()` function

---

### 2. Get Media List
**Endpoint:** `GET /api/menu/menu-items/{uuid:id}/media-list`

**Description:** Retrieve all media (images, videos) for a menu item

**Returns:** Array of media items with metadata (id, type, url, is_primary, order)

**Implementation Location:** `/lib/api/menu-media.ts` - `getMediaList()` function

---

### 3. Update Media
**Endpoint:** `PUT /api/menu/menu-items/media/{uuid:id}/update`

**Payload:**
```json
{
  "is_primary": true,
  "order": 1
}
```

**Description:** Update media properties (set as primary, reorder)

**Implementation Location:** `/lib/api/menu-media.ts` - `updateMedia()` function

---

### 4. Delete Media
**Endpoint:** `DELETE /api/menu/menu-items/media/{uuid:id}/delete`

**Description:** Remove a media item from menu

**Implementation Location:** `/lib/api/menu-media.ts` - `deleteMedia()` function

---

### 5. Reorder Media
**Endpoint:** `POST /api/menu/menu-items/media/reorder`

**Payload:**
```json
{
  "ids": [
    "media1_uuid",
    "media2_uuid",
    "media3_uuid"
  ]
}
```

**Description:** Reorder multiple media items (drag-and-drop)

**Implementation Location:** `/lib/api/menu-media.ts` - `reorderMedia()` function

---

## Integration Points

### Menu Page Integration
**Location:** `/app/admin/menu/page.tsx`

#### Features:
1. **Auto Media Modal on Create** - Opens media upload modal immediately after creating a new menu item
2. **Media Management Action** - Dedicated media button in table (purple icon) to manage existing media
3. **Seamless Workflow** - Users can add images/videos right after creating a menu item

#### State Management:
```javascript
const [showMediaModal, setShowMediaModal] = useState(false)
const [mediaModalItem, setMediaModalItem] = useState<any>(null)
```

---

### Media Upload Modal Component
**Location:** `/components/admin/menu-media-upload-modal.tsx`

#### Features:
- **Multiple Media Upload** - Add multiple images and videos to a single menu item
- **Media Type Selection** - Toggle between image upload and video URL input
- **Image Preview** - File selection with validation
- **Video URL Support** - Paste YouTube/Vimeo links directly
- **Drag-and-Drop Reordering** - Reorder media items with intuitive drag interface
- **Set Primary Media** - Mark one media item as primary/featured
- **Delete Media** - Remove individual media items
- **Real-time Sync** - All changes immediately save to server

#### Props:
```typescript
interface MenuMediaUploadModalProps {
  menuItemId: string          // UUID of menu item
  menuItemName: string        // Display name
  onClose: () => void         // Close handler
  onSuccess?: () => void      // Optional success callback
}
```

---

### Data Table Integration
**Location:** `/components/admin/data-table.tsx`

#### New Features:
- **Media Action Button** - Purple image icon for managing media
- **onMedia Callback** - Custom handler for media button clicks

#### Updated Props:
```typescript
interface DataTableProps {
  // ... existing props
  onMedia?: (row: any) => void  // Media management handler
}
```

---

## API Configuration
**Location:** `/lib/api/config.ts`

**Menu Media Endpoints:**
```typescript
MENU_MEDIA_UPLOAD: (id: string) => `/api/menu/menu-items/${id}/media`,
MENU_MEDIA_LIST: (id: string) => `/api/menu/menu-items/${id}/media-list`,
MENU_MEDIA_UPDATE: (id: string) => `/api/menu/menu-items/media/${id}/update`,
MENU_MEDIA_DELETE: (id: string) => `/api/menu/menu-items/media/${id}/delete`,
MENU_MEDIA_REORDER: '/api/menu/menu-items/media/reorder',
```

---

## Authentication
All API calls use Bearer token authentication via `getToken()` function from `/lib/api/auth.ts`

Header Format:
```
Authorization: Bearer {token}
```

---

## Error Handling
- **Network Errors** - Displayed as red alert in modal
- **Validation Errors** - Field-level validation with user-friendly messages
- **Upload Failures** - Detailed error messages with retry capability

---

## Usage Flow

### Creating Menu Item with Media
1. Admin clicks "Add Item" button
2. Fills menu form and submits
3. Media upload modal automatically appears
4. Admin adds images/videos (optional)
5. Can reorder, delete, or set primary media
6. Closes modal to complete setup

### Managing Existing Media
1. In menu table, click purple image icon on any row
2. Media modal opens with existing media
3. Can add more, delete, or reorder existing media
4. Changes save immediately

---

## File Structure
```
lib/api/
  ├── menu-media.ts (API functions)
  └── config.ts (endpoints configuration)

components/admin/
  ├── menu-media-upload-modal.tsx (UI component)
  └── data-table.tsx (updated with media action)

app/admin/
  └── menu/page.tsx (menu management page)
```

---

## Testing Checklist
- [ ] Upload image to menu item
- [ ] Upload multiple images
- [ ] Add video via URL
- [ ] Set image as primary
- [ ] Reorder media with drag-and-drop
- [ ] Delete media item
- [ ] Media modal auto-opens on create
- [ ] Media button works on existing items
- [ ] All errors handled gracefully

---

## Notes
- First uploaded media is automatically set as primary
- Media appears in real-time without page refresh
- Drag-and-drop updates order immediately
- All FormData payloads properly formatted for backend
