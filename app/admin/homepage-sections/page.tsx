


'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, X, Check } from 'lucide-react'
import { homepageSectionsAPI } from '@/lib/api/homepage-sections'

interface Section {
  id: string
  title: string
  type: 'hero' | 'featured' | 'testimonials' | 'menu' | 'offers' | 'cta' | 'faq' | 'custom'
  order: number
  isVisible: boolean
  content: string
  createdAt: string
}

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [draggedSection, setDraggedSection] = useState<Section | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    type: 'featured' as const,
    content: '',
  })

  const sectionTypes = [
  
    { value: 'featured', label: 'Featured Items' },
    { value: 'testimonials', label: 'Testimonials' },
   
    { value: 'offers', label: 'Offers' },
    
    { value: 'gallery', label: 'Gallery' },
    { value: 'custom', label: 'Custom Section' },
  ]

  // ✅ Load Sections From API
  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
  try {

    const response = await homepageSectionsAPI.listSections()

    console.log("Sections API Response:", response)

    const list =
      response?.data ||
      response?.results ||
      response ||
      []

    const mapped = list.map((section: any) => ({

      id: section.id,

      title: section.title,

      // ✅ API uses section_type
      type: section.section_type || section.type,

      order: section.order ?? 0,

      // ✅ API uses is_visible
      isVisible: section.is_visible ?? section.isVisible ?? true,

      // ✅ API uses description
      content: section.description || section.content || "",

      // ✅ API uses created_at
      createdAt: section.created_at || section.createdAt || ""

    }))

    console.log("Mapped Sections:", mapped)

    setSections(mapped)

  } catch (error) {

    console.error('Failed to load sections', error)

  }
}

  // ✅ Add Section
  const handleAddSection = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a section title')
      return
    }

    try {
      await homepageSectionsAPI.createSection({
        title: formData.title,
        type: formData.type,
        content: formData.content,
        order: sections.length + 1,
        isVisible: true,
      })

      setSuccessMessage(`${formData.title} added successfully`)
      setTimeout(() => setSuccessMessage(''), 3000)

      resetForm()
      loadSections()
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Update Section
  const handleUpdateSection = async () => {
    if (!editingSection || !formData.title.trim()) {
      alert('Please enter a section title')
      return
    }

    try {
      await homepageSectionsAPI.updateSection(editingSection.id, {
        title: formData.title,
        type: formData.type,
        content: formData.content,
      })

      setSuccessMessage(`${formData.title} updated successfully`)
      setTimeout(() => setSuccessMessage(''), 3000)

      resetForm()
      loadSections()
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Delete Section
  const handleDeleteSection = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" section?`)) return

    try {
      await homepageSectionsAPI.deleteSection(id)

      setSuccessMessage(`${title} deleted successfully`)
      setTimeout(() => setSuccessMessage(''), 3000)

      loadSections()
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Toggle Visibility
  const handleToggleVisibility = async (id: string) => {
    const section = sections.find((s) => s.id === id)
    if (!section) return

    try {
      await homepageSectionsAPI.toggleVisibility(id, !section.isVisible)
      loadSections()
    } catch (error) {
      console.error(error)
    }
  }

  // Drag
  const handleDragStart = (section: Section) => {
    setDraggedSection(section)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
 
const handleDrop = async (targetSection: Section) => {

  if (!draggedSection || draggedSection.id === targetSection.id) return

  const draggedIndex = sections.findIndex((s) => s.id === draggedSection.id)
  const targetIndex = sections.findIndex((s) => s.id === targetSection.id)

  const newSections = [...sections]

  // remove dragged section
  newSections.splice(draggedIndex, 1)

  // insert at target position
  newSections.splice(targetIndex, 0, draggedSection)

  const reordered = newSections.map((s, index) => ({
    ...s,
    order: index + 1
  }))

  setSections(reordered)
  setDraggedSection(null)

  try {

    // ⭐ Backend expects ids
    const ids = reordered.map((s) => s.id)

    console.log("Reorder Payload:", { ids })

    await homepageSectionsAPI.reorderSections({
      ids: ids
    })

    setSuccessMessage('Section order updated')
    setTimeout(() => setSuccessMessage(''), 2000)

  } catch (error) {

    console.error("Reorder API failed:", error)

  }
}

 const handleEditClick = async (section: Section) => {

  try {

    console.log("Fetching section:", section.id)

    const response = await homepageSectionsAPI.getSection(section.id)

    console.log("Edit API Response:", response)

    const apiSection = response?.data?.[0]

    if (!apiSection) {
      console.warn("Section not found")
      return
    }

    const mappedSection: Section = {

      id: apiSection.id,
      title: apiSection.title,
      type: apiSection.section_type,
      order: apiSection.order,
      isVisible: apiSection.is_visible,
      content: apiSection.description || "",
      createdAt: apiSection.created_at

    }

    setEditingSection(mappedSection)

    setFormData({
      title: mappedSection.title,
      type: mappedSection.type,
      content: mappedSection.content
    })

    setShowModal(true)

  } catch (error) {

    console.error("Failed to fetch section for edit", error)

  }

}

  const resetForm = () => {
    setShowModal(false)
    setEditingSection(null)

    setFormData({
      title: '',
      type: 'featured',
      content: '',
    })
  }

  const getTypeLabel = (type: string) => {
    return sectionTypes.find((t) => t.value === type)?.label || type
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg text-white flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Homepage Sections</h1>
            <p className="text-red-100 mt-1">Manage and reorder homepage sections</p>
          </div>

          <button
            onClick={() => {
              setEditingSection(null)
              setFormData({ title: '', type: 'featured', content: '' })
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-red-900 mb-2">How to Manage Sections:</h4>
          <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
            <li>Drag sections to reorder them on the homepage</li>
            <li>Toggle visibility to show or hide sections without deleting</li>
            <li>Edit section content and settings anytime</li>
            <li>Delete sections you no longer need</li>
            <li>Changes are saved automatically</li>
          </ul>
        </div>

        {/* Sections List */}
        <div className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-red-100 to-red-50 px-6 py-4 border-b-2 border-red-200">
            <h3 className="text-lg font-bold text-red-700">
              Sections ({sortedSections.length})
            </h3>
          </div>

          {sortedSections.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">
                No sections yet. Create your first section!
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Add First Section
              </button>
            </div>
          ) : (
            <div className="divide-y divide-red-100">
              {sortedSections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(section)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(section)}
                  className={`p-6 hover:bg-red-50 transition-all cursor-move ${
                    draggedSection?.id === section.id
                      ? 'opacity-50 bg-red-100'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <div className="flex flex-col items-center gap-1">
                      <GripVertical size={20} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-500">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {section.title}
                          </h4>

                          <p className="text-sm text-gray-600 mt-1">
                            Type: {getTypeLabel(section.type)}
                          </p>

                          {section.content && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {section.content}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => handleToggleVisibility(section.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              section.isVisible
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {section.isVisible ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </button>

                          <button
                            onClick={() => handleEditClick(section)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteSection(section.id, section.title)
                            }
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal UI unchanged */}
      {/* Success Toast unchanged */}

      
      {/* Add/Edit Section Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Section Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Featured Dishes, Special Offers"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Section Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                >
                  {sectionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Add details about this section..."
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSection ? handleUpdateSection : handleAddSection}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {editingSection ? 'Update Section' : 'Add Section'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check size={20} />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

    </AdminLayout>
  )
}