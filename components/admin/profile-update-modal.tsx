'use client'

import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { profileAPI } from '@/lib/api/profile'
import { useToast } from '@/hooks/use-toast'

interface ProfileUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  currentProfile?: {
    full_name?: string
    profile_image?: string
  }
}

export function ProfileUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  currentProfile,
}: ProfileUpdateModalProps) {
  const [fullName, setFullName] = useState(currentProfile?.full_name || '')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(currentProfile?.profile_image || '')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file',
          variant: 'destructive',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your full name',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const updateData: any = {
        full_name: fullName,
      }

      // Include image file if selected
      if (profileImage) {
        updateData.profile_image = profileImage
      }

      const result = await profileAPI.updateProfile(updateData)
      console.log('[v0] Profile updated:', result)

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('[v0] Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 text-gray-900"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Profile Picture
            </label>

            {/* Preview */}
            {preview && (
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  {profileImage ? 'Change Image' : 'Choose Image'}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Max 5MB. JPG, PNG, or GIF.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
