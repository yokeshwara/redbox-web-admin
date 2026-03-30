'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { Plus, Search, Trash2, Edit2, X, Check } from 'lucide-react'
import { mediaLibraryAPI } from '@/lib/api/media-library'

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([])
  const [filteredMedia, setFilteredMedia] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [editingMedia, setEditingMedia] = useState<any>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [updateName, setUpdateName] = useState('')
  const [updateFile, setUpdateFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const itemsPerPage = 12

  useEffect(() => {
    const mockMedia = [
      { id: '1', name: 'Biryani.jpg', url: 'https://images.unsplash.com/photo-1585521922317-68873f34fbf5?w=200&h=200&fit=crop&q=80', uploadedAt: '2024-03-05' },
      { id: '2', name: 'PaneerTikka.jpg', url: 'https://images.unsplash.com/photo-1587080391619-55b73b0f69bb?w=200&h=200&fit=crop&q=80', uploadedAt: '2024-03-04' },
      { id: '3', name: 'Restaurant.jpg', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=80', uploadedAt: '2024-03-03' },
    ]
    setMedia(mockMedia)
    setFilteredMedia(mockMedia)
  }, [])

  useEffect(() => {
    const filtered = media.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredMedia(filtered)
    setCurrentPage(1)
  }, [searchTerm, media])

  const handleUpload = async () => {
    if (!uploadName.trim() || !uploadFile) {
      alert('Please enter a name and select a file')
      return
    }

    setIsLoading(true)
    try {
      // In a real scenario, you'd call the API here
      // const result = await mediaLibraryAPI.uploadMedia(uploadName, uploadFile)
      
      // For now, create a mock entry
      const newMedia = {
        id: Date.now().toString(),
        name: uploadName,
        url: URL.createObjectURL(uploadFile),
        uploadedAt: new Date().toISOString().split('T')[0],
      }
      setMedia([newMedia, ...media])
      setSuccessMessage(`${uploadName} uploaded successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      resetUploadModal()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload media')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!updateName.trim()) {
      alert('Please enter a name')
      return
    }

    setIsLoading(true)
    try {
      // In a real scenario, you'd call the API here
      // const result = await mediaLibraryAPI.updateMedia(editingMedia.id, updateName, updateFile)
      
      // For now, update the mock entry
      setMedia(
        media.map((m) =>
          m.id === editingMedia.id
            ? {
                ...m,
                name: updateName,
                url: updateFile ? URL.createObjectURL(updateFile) : m.url,
              }
            : m
        )
      )
      setSuccessMessage(`${updateName} updated successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      resetUpdateModal()
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update media')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (mediaItem: any) => {
    if (!confirm('Delete this image?')) return

    try {
      // In a real scenario, you'd call the API here
      // await mediaLibraryAPI.deleteMedia(mediaItem.id)
      
      setMedia(media.filter((m) => m.id !== mediaItem.id))
      setSuccessMessage(`${mediaItem.name} deleted successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete media')
    }
  }

  const handleEditClick = (mediaItem: any) => {
    setEditingMedia(mediaItem)
    setUpdateName(mediaItem.name)
    setUpdateFile(null)
    setShowUpdateModal(true)
  }

  const resetUploadModal = () => {
    setShowUploadModal(false)
    setUploadName('')
    setUploadFile(null)
  }

  const resetUpdateModal = () => {
    setShowUpdateModal(false)
    setEditingMedia(null)
    setUpdateName('')
    setUpdateFile(null)
  }

  const paginatedMedia = filteredMedia.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-sm text-gray-600 mt-1">Manage website images and media</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-semibold transition-all">
            <Plus size={20} />
            Upload Image
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-2">
          <Search size={18} className="text-primary" />
          <input type="text" placeholder="Search media..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-gray-900 bg-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedMedia.map((mediaItem) => (
            <div key={mediaItem.id} className="relative group rounded-lg overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
              <img src={mediaItem.url} alt={mediaItem.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleEditClick(mediaItem)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(mediaItem)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-600 px-2 py-1 truncate">{mediaItem.name}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredMedia.length} itemsPerPage={itemsPerPage} />}
      </div>

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check size={20} />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
              <button onClick={resetUploadModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Image Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Burger Image"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                />
                {uploadFile && <p className="text-sm text-green-600 mt-2">✓ {uploadFile.name}</p>}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={resetUploadModal} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={isLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && editingMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Update Image</h2>
              <button onClick={resetUpdateModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <img src={updateFile ? URL.createObjectURL(updateFile) : editingMedia.url} alt="preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Image Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Burger Image"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Replace Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdateFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                />
                {updateFile && <p className="text-sm text-green-600 mt-2">✓ {updateFile.name}</p>}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={resetUpdateModal} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
