'use client'

import { X } from 'lucide-react'

interface CRUDModalProps {
  isOpen: boolean
  title: string
  isEditing: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  submitLabel?: string
  children: React.ReactNode
}

export function CRUDModal({
  isOpen,
  title,
  isEditing,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  children,
}: CRUDModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? `Edit ${title}` : `Add New ${title}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              {isEditing ? 'Update' : 'Create'} {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
