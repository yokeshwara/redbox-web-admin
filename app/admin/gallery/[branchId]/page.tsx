'use client'

import { useState, useRef, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ArrowLeft, Upload, Trash2, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Clock, Star, Grid, List, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { galleryAPI } from '@/lib/api/gallery'
import { branchesAPI } from '@/lib/api/branches'
import { useToast } from '@/hooks/use-toast'

interface BranchData {
  id: number
  name: string
  address: string
  city: string
  phone: string
  email: string
  hours: string
  rating: number
  reviews: number
  images: string[]
  latitude?: number
  longitude?: number
}

interface GalleryImage {
  id: string
  image: string
  image_url?: string
  image_type: string
  branch: string
}

export default function GalleryPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { toast } = useToast()
  const [branch, setBranch] = useState<BranchData | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid')
  const [branchId, setBranchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extract branchId from params
  useEffect(() => {
    params.then((p) => setBranchId(p.branchId))
  }, [params])

  // Load branch data and gallery images
  useEffect(() => {
    if (!branchId) return
    loadGalleryImages()
  }, [branchId])

  const loadGalleryImages = async () => {
    if (!branchId) return
    setLoading(true)
    try {
      const [galleryResponse, branchResponse] = await Promise.all([
        galleryAPI.list(branchId),
        branchesAPI.getBranch(branchId),
      ])

      const galleryList = (Array.isArray(galleryResponse)
        ? galleryResponse
        : galleryResponse.data?.results || galleryResponse.results || []
      ).map((img: any) => ({
        ...img,
        image: img.image_url || img.image || '',
      }))

      setImages(galleryList)

      const branchData: BranchData = {
        id: Number(branchResponse.id) || 0,
        name: branchResponse.name,
        address: branchResponse.address,
        phone: branchResponse.phone,
        email: branchResponse.email,
        city: branchResponse.city,
        hours: branchResponse.operating_hours || 'Not disclosed',
        rating: Number(branchResponse.rating || 0),
        reviews: Number(branchResponse.reviews_count || branchResponse.reviews?.length || 0),
        images: galleryList.map((img: GalleryImage) => img.image),
        latitude: branchResponse.latitude ? Number(branchResponse.latitude) : undefined,
        longitude: branchResponse.longitude ? Number(branchResponse.longitude) : undefined,
      }

      setBranch(branchData)
    } catch (error: any) {
      console.error('Error loading gallery:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load gallery images',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !branchId) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const uploadedImage = await galleryAPI.upload(branchId, file)
        setImages((prev) => [...prev, {
          ...uploadedImage,
          image: uploadedImage.image_url || uploadedImage.image || '',
        }])
        toast({
          title: 'Success',
          description: `${file.name} uploaded successfully`,
        })
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageId: string, index: number) => {
    setDeleting(imageId)
    try {
      await galleryAPI.delete(branchId, imageId)
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      if (selectedImageIndex >= newImages.length) {
        setSelectedImageIndex(Math.max(0, newImages.length - 1))
      }
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete image',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading gallery...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!branch) {
    return (
      <AdminLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load branch details.
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/branches"
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Branches
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-foreground hover:bg-gray-300'
              }`}
            >
              <Grid size={18} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                viewMode === 'slider'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-foreground hover:bg-gray-300'
              }`}
            >
              <List size={18} />
              Slider
            </button>
          </div>
        </div>

        {/* Branch Info Section */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{branch.name}</h1>
              <p className="text-white/90 text-sm md:text-base">{branch.address}, {branch.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/90 text-sm">Rating</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-2xl font-bold">{branch.rating}</span>
                  <span className="text-xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-primary/30 rounded-lg p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Location</p>
                <p className="text-sm font-semibold text-foreground">{branch.city}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-primary/30 rounded-lg p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Phone className="text-primary flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Phone</p>
                <p className="text-sm font-semibold text-foreground">{branch.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-primary/30 rounded-lg p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Mail className="text-primary flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Email</p>
                <p className="text-sm font-semibold text-foreground truncate">{branch.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-primary/30 rounded-lg p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Clock className="text-primary flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Hours</p>
                <p className="text-sm font-semibold text-foreground">{branch.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-6">
          {/* View Mode: Slider */}
          {viewMode === 'slider' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>

              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image Display */}
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden group shadow-xl">
                    <img
                      src={images[selectedImageIndex]?.image}
                      alt={`Gallery ${selectedImageIndex + 1}`}
                      className="w-full h-[500px] object-cover"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft size={28} />
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight size={28} />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-primary shadow-lg scale-105'
                              : 'border-gray-300 hover:border-primary/60'
                          }`}
                        >
                          <img
                            src={image.image}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-24 object-cover hover:scale-110 transition-transform"
                            onClick={() => setSelectedImageIndex(index)}
                          />
                          <button
                            onClick={() => handleRemoveImage(image.id, index)}
                            disabled={deleting === image.id}
                            className="absolute top-1 right-1 bg-primary hover:bg-primary/80 text-white p-1 rounded transition-colors opacity-0 hover:opacity-100 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-16 text-center bg-gradient-to-br from-primary/5 to-white">
                  <ImageIcon size={64} className="text-primary/40 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2 text-lg">No images added yet</p>
                  <p className="text-gray-500 text-sm">Upload photos to get started</p>
                </div>
              )}
            </div>
          )}

          {/* View Mode: Grid */}
          {viewMode === 'grid' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all bg-gray-200 h-64"
                    >
                      <img
                        src={image.image}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleRemoveImage(image.id, index)}
                          disabled={deleting === image.id}
                          className="bg-primary hover:bg-primary/80 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-16 text-center bg-gradient-to-br from-primary/5 to-white">
                  <ImageIcon size={64} className="text-primary/40 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2 text-lg">No images added yet</p>
                  <p className="text-gray-500 text-sm">Upload photos to get started</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white border-2 border-primary/20 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Add Photos</h2>

          <label className="border-2 border-dashed border-primary/40 rounded-lg p-12 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-all bg-gradient-to-br from-white to-primary/3 block">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="text-primary" size={40} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">Upload from Device</p>
                <p className="text-sm text-gray-600 mt-1">JPG, PNG, WebP up to 10MB</p>
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
          </label>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Browse Files'}
            </button>
            <button 
              onClick={loadGalleryImages}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-foreground font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Gallery'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-600 text-sm font-semibold mb-2">Total Photos</p>
            <p className="text-4xl font-bold text-blue-600">{images.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <p className="text-green-600 text-sm font-semibold mb-2">Customer Reviews</p>
            <p className="text-4xl font-bold text-green-600">{branch.reviews}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-600 text-sm font-semibold mb-2">Rating</p>
            <p className="text-4xl font-bold text-yellow-600">{branch.rating}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
