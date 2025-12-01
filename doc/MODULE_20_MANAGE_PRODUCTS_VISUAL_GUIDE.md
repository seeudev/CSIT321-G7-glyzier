# ManageProducts File Upload - Visual UI Guide

## Component Layout

### Edit Mode Form Structure

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Edit Product                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Product Name: [Input Field]                                │
│  Product Description: [Textarea]                            │
│  Price: [$______]    Type: [Dropdown]    Status: [Dropdown] │
│  Quantity: [____]    Category: [Dropdown]                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🖼️  Product Images (Multiple)                        │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Drag & drop images here or click to browse │    │  │
│  │  │  Max 5 files · JPEG, PNG, WebP · Max 10MB   │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  Uploaded Images:                                    │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐               │  │
│  │  │ [img1] │  │ [img2] │  │ [img3] │               │  │
│  │  │ 🗑️ Del │  │ 🗑️ Del │  │ 🗑️ Del │               │  │
│  │  └────────┘  └────────┘  └────────┘               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 👁️  Preview/Thumbnail Image (Single)                 │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Drag & drop preview image or click         │    │  │
│  │  │  Single file · JPEG, PNG, WebP · Max 10MB   │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  Current Preview:                                    │  │
│  │  ┌────────┐                                          │  │
│  │  │ [prev] │                                          │  │
│  │  │ 🗑️ Del │                                          │  │
│  │  └────────┘                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 💾 Digital Product File (Single)                      │  │
│  │ Upload the digital file that customers will download │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Drag & drop digital file or click          │    │  │
│  │  │  ZIP, PDF, PSD, AI · Max 100MB              │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  Current Digital File:                               │  │
│  │  ┌────────┐                                          │  │
│  │  │   💾   │                                          │  │
│  │  │Digital │                                          │  │
│  │  │  File  │                                          │  │
│  │  │ 🗑️ Del │                                          │  │
│  │  └────────┘                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [✅ Save]  [Cancel]                                        │
└─────────────────────────────────────────────────────────────┘
```

## UI States

### 1. **Empty State** (No Files Uploaded)

Each file section shows the FileUpload component with drag-and-drop zone:

```
┌──────────────────────────────────────────────┐
│ 🖼️  Product Images (Multiple)                │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │                                      │    │
│  │       📁 Drag & drop files here      │    │
│  │         or click to browse           │    │
│  │                                      │    │
│  │   Max 5 files · JPEG, PNG, WebP     │    │
│  │         Max 10MB per file            │    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

### 2. **Uploading State** (Files Being Uploaded)

Progress bars appear during upload:

```
┌──────────────────────────────────────────────┐
│ 🖼️  Product Images (Multiple)                │
│                                               │
│  Uploading: image1.jpg                       │
│  ████████████░░░░░░░░░░░░  45%              │
│                                               │
│  Uploading: image2.jpg                       │
│  ██████████████████░░░░░░  72%              │
└──────────────────────────────────────────────┘
```

### 3. **Uploaded State** (Files Successfully Uploaded)

Thumbnails appear with delete buttons:

```
┌──────────────────────────────────────────────┐
│ 🖼️  Product Images (Multiple)                │
│                                               │
│  ┌────────┐  ┌────────┐  ┌────────┐         │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │         │
│  │        │  │        │  │        │         │
│  │        │  │        │  │        │         │
│  │ 🗑️ Del │  │ 🗑️ Del │  │ 🗑️ Del │         │
│  └────────┘  └────────┘  └────────┘         │
│                                               │
│  Can still upload 2 more images              │
└──────────────────────────────────────────────┘
```

### 4. **Deleting State** (File Being Deleted)

Delete button shows loading:

```
┌────────┐
│ [IMG]  │
│        │
│        │
│  ...   │  ← Loading state
└────────┘
```

### 5. **Digital File Display**

Digital files show icon instead of thumbnail:

```
┌──────────────────────────────────────────────┐
│ 💾 Digital Product File (Single)              │
│                                               │
│  ┌────────┐                                  │
│  │   💾   │                                  │
│  │        │                                  │
│  │Digital │                                  │
│  │  File  │                                  │
│  │        │                                  │
│  │ 🗑️ Del │                                  │
│  └────────┘                                  │
└──────────────────────────────────────────────┘
```

## Color Scheme

### File Upload Sections
- **Border**: `#e0e0e0` (light gray)
- **Border Hover**: `#8b7fc4` (purple)
- **Background**: `white`
- **Background Hover**: `#fafafa` (off-white)

### Delete Buttons
- **Gradient Start**: `#ff6b6b` (red)
- **Gradient End**: `#ee5a6f` (darker red)
- **Hover Start**: `#ee5a6f`
- **Hover End**: `#dc143c` (crimson)
- **Shadow**: `rgba(255, 107, 107, 0.3)`

### File Cards
- **Background**: `white`
- **Border**: `#e0e0e0`
- **Border Hover**: `#8b7fc4` (purple)
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)`

## Responsive Behavior

### Desktop (>968px)
- File cards display in grid (3-4 per row)
- All sections visible side-by-side
- Full-width thumbnails (100px)

### Tablet (480px - 968px)
- File cards display in grid (2 per row)
- Sections stack vertically
- Thumbnails remain 100px

### Mobile (<480px)
- File cards display in single column
- Sections stack vertically
- Thumbnails scale down to fit screen
- Touch-friendly button sizes

## Interactive Features

### Hover Effects
- **File Cards**: Lift 2px, border color changes to purple
- **Delete Buttons**: Darken gradient, lift 2px, show shadow
- **Upload Zones**: Border color changes to purple, background lightens

### Drag & Drop
1. User drags file over upload zone
2. Border changes to purple dashed
3. Background lightens
4. "Drop here" text appears
5. On drop, file validation starts
6. Upload progress shows

### Confirmation Dialogs
- **Delete File**: "Are you sure you want to delete this file?"
- **Delete Product**: "Are you sure you want to delete '[Product Name]'? This action cannot be undone."

## Notification Messages

### Success Messages
- ✅ "3 image(s) uploaded successfully!"
- ✅ "Preview image uploaded successfully!"
- ✅ "Digital file uploaded successfully!"
- ✅ "File deleted successfully"

### Error Messages
- ❌ "Failed to upload images: File too large"
- ❌ "Failed to upload preview: Invalid file type"
- ❌ "Failed to delete file: Unauthorized"
- ❌ "Only JPEG, PNG, and WebP images are allowed"

## Accessibility Features

### Keyboard Navigation
- Tab through upload zones
- Enter/Space to open file picker
- Tab through delete buttons
- Enter to confirm delete

### Screen Reader Support
- Upload zones labeled with file type
- Delete buttons labeled with file name
- Progress announcements during upload
- Success/error announcements

### ARIA Attributes
- `role="button"` on upload zones
- `aria-label="Delete [filename]"` on delete buttons
- `aria-busy="true"` during uploads
- `aria-live="polite"` for notifications

---

**Visual Guide Status**: ✅ **COMPLETE**  
*Companion to MODULE_20_MANAGE_PRODUCTS_COMPLETION.md*
