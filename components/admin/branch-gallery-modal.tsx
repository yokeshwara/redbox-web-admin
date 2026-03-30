'use client'

import { useState, useRef } from 'react'
import { X, Upload, MapPin, Phone, Mail, Clock, Star, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface BranchGalleryModalProps {
  branch: any
  onClose: () => void
  onUpdateBranch: (branch: any) => void
}

export function BranchGalleryModal({ branch, onClose, onUpdateBranch }: BranchGalleryModalProps) {
  const [images, setImages] = useState<string[]>(branch.images || [])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => {
        return URL.createObjectURL(file)
      })
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1))
    }
  }

  const handleSave = () => {
    onUpdateBranch({ ...branch, images })
    onClose()
  }

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-primary/20 bg-gradient-to-r from-white to-primary/5">
          <h2 className="text-2xl font-bold text-foreground">{branch.name} - Gallery</h2>
          <button onClick={onClose} className="p-1 hover:bg-primary/10 rounded transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Branch Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border-2 border-primary/30">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Location</p>
                  <p className="text-foreground font-semibold">{branch.address}</p>
                  <p className="text-sm text-gray-600">{branch.city}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <Star className="text-yellow-600 flex-shrink-0 mt-1 fill-yellow-600" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Rating</p>
                  <p className="text-foreground font-bold text-lg">{branch.rating} ⭐</p>
                  <p className="text-sm text-gray-600">{branch.reviews} reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Clock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Hours</p>
                  <p className="text-foreground font-semibold">{branch.hours}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <Phone className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Contact</p>
                  <p className="text-foreground font-semibold text-sm">{branch.phone}</p>
                  <p className="text-foreground font-semibold text-sm">{branch.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Gallery */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Photo Gallery</h3>

            {images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image Display */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden group">
                  <img
                    src={images[selectedImageIndex]}
                    alt="Branch"
                    className="w-full h-96 object-cover"
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImageIndex === index ? 'border-primary shadow-lg' : 'border-gray-300 hover:border-primary/60'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index}`}
                          className="w-full h-20 object-cover hover:scale-110 transition-transform"
                          onClick={() => setSelectedImageIndex(index)}
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-primary hover:bg-primary/80 text-white p-1 rounded transition-colors opacity-0 hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                <ImageIcon size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">No images added yet</p>
                <p className="text-gray-500 text-sm">Upload photos from Unsplash or your device</p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Add Photos</h3>

            {/* Upload Options */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-all bg-gradient-to-br from-white to-primary/3"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-primary" size={40} />
                <div>
                  <p className="font-semibold text-foreground">Upload from Device</p>
                  <p className="text-xs text-gray-600">JPG, PNG, WebP up to 10MB</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Map Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Branch Location</h3>
            <div className="bg-gradient-to-br from-primary/5 to-white rounded-lg p-4 flex items-center justify-center h-64 border-2 border-primary/30">
              <div className="text-center">
                <MapPin size={48} className="text-primary mx-auto mb-2" />
                <p className="text-gray-600 font-semibold mb-2">Map View</p>
                <p className="text-sm text-gray-600">Latitude: {branch.latitude?.toFixed(4)}</p>
                <p className="text-sm text-gray-600">Longitude: {branch.longitude?.toFixed(4)}</p>
                <p className="text-xs text-gray-500 mt-3">Interactive map integration available</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t-2 border-primary/20 sticky bottom-0 bg-gradient-to-r from-white to-primary/3">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-foreground font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
