'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Phone, Mail, Clock, Zap, Star, Upload, Image as ImageIcon, MessageSquare, Trash2, Map } from 'lucide-react'
import { TimeRangePicker } from './time-range-picker'
import { DeliveryTimePicker } from './delivery-time-picker'
import { FormError } from './form-error'
import { validateBranchForm } from '@/lib/validation'
import { galleryAPI } from '@/lib/api/gallery'

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dzdeqpivt/'

function resolveAssetUrl(value?: string | null) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }

  const normalized = value.startsWith('/') ? value.slice(1) : value
  return `${CLOUDINARY_BASE_URL}${normalized}`
}

function parseOperatingHours(value?: string) {
  if (!value || !value.includes(' - ')) {
    return { start: '', end: '' }
  }

  const [start, end] = value.split(' - ').map((part) => part.trim())
  return { start, end }
}

function parseDeliveryTime(value?: string) {
  if (!value) {
    return { min: 0, max: 0 }
  }

  const matches = value.match(/\d+/g) || []
  return {
    min: Number(matches[0] || 0),
    max: Number(matches[1] || 0),
  }
}

interface BranchFormModalProps {
  branch?: any
  onSubmit: (data: any) => void
  onClose: () => void
  onOpenGallery?: (branch: any) => void
}

interface GalleryItem {
  id?: string
  url: string
  file?: File
}

export function BranchFormModal({ branch, onSubmit, onClose }: BranchFormModalProps) {

  const [formData, setFormData] = useState<any>({
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    operating_hours: '',
    delivery_time_min: 0,
    delivery_time_max: 0,
    latitude: '',
    longitude: '',
    cuisine_type: '',
    restaurant_type: '',
    rating: '',
    reviews_count: '',
    banner_image: null,
    banner_preview: '', // <-- preview string
    swiggy: '',
    zomato: '',
    whatsapp: '',
    maps_iframe: '',
    reviews: [],
  })

  const [operatingHoursStart, setOperatingHoursStart] = useState('')
  const [operatingHoursEnd, setOperatingHoursEnd] = useState('')
  const [errors, setErrors] = useState<any>({})

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryDeleting, setGalleryDeleting] = useState<string | null>(null)

  const loadBranchGallery = async (branchId: string) => {
    const galleryResponse = await galleryAPI.list(branchId)
    const galleryList = (Array.isArray(galleryResponse)
      ? galleryResponse
      : galleryResponse.data?.results || galleryResponse.results || []
    ).map((image: any) => ({
      id: image.id,
      url: resolveAssetUrl(image.image_url || image.image),
    }))

    setGalleryItems(galleryList)
  }

  useEffect(() => {
    if (branch) {
      const { start, end } = parseOperatingHours(branch.operating_hours)
      const { min, max } = parseDeliveryTime(branch.delivery_time)
      const platformDetails = branch.delivery_platform_details || branch.delivery_platforms || []
      const swiggyLink = platformDetails.find((item: any) => item.name === 'Swiggy')?.url || ''
      const zomatoLink = platformDetails.find((item: any) => item.name === 'Zomato')?.url || ''
      const whatsappLink =
        platformDetails.find((item: any) => item.name === 'WhatsApp')?.url ||
        platformDetails.find((item: any) => item.name === 'Dunzo')?.url ||
        ''

      setFormData({
        ...branch,
        delivery_time_min: min,
        delivery_time_max: max,
        latitude: branch.latitude ?? '',
        longitude: branch.longitude ?? '',
        banner_preview: '',
        swiggy: swiggyLink,
        zomato: zomatoLink,
        whatsapp: whatsappLink,
      })
      setOperatingHoursStart(start)
      setOperatingHoursEnd(end)

      if (branch.id) {
        loadBranchGallery(branch.id).catch(() => {
          const fallbackGallery = (branch.gallery || [])
            .map((image: any) => ({
              id: image.id,
              url: resolveAssetUrl(image.image_url || image.image),
            }))
            .filter((image: GalleryItem) => Boolean(image.url))
          setGalleryItems(fallbackGallery)
        })
      } else if (branch.gallery?.length) {
        const fallbackGallery = branch.gallery
          .map((image: any) => ({
            id: image.id,
            url: resolveAssetUrl(image.image_url || image.image),
          }))
          .filter((image: GalleryItem) => Boolean(image.url))
        setGalleryItems(fallbackGallery)
      } else {
        setGalleryItems([])
      }

      // Initialize banner preview if banner exists
      if ((branch.banner_image_url && typeof branch.banner_image_url === 'string') || (branch.banner_image && typeof branch.banner_image === 'string')) {
        setFormData(prev => ({
          ...prev,
          banner_preview: branch.banner_image_url || resolveAssetUrl(branch.banner_image)
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          banner_preview: '',
        }))
      }
    }
  }, [branch])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  /* -----------------------------------------------------
     Banner Upload
  ----------------------------------------------------- */
  const handleBannerUpload = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev: any) => ({
        ...prev,
        banner_image: file,          // store File for FormData
        banner_preview: reader.result, // store base64 for preview
      }))
    }
    reader.readAsDataURL(file)
  }

  /* -----------------------------------------------------
     Gallery Upload
  ----------------------------------------------------- */
  const handleGalleryPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const selectedFiles = Array.from(files)

    if (branch?.id) {
      setGalleryUploading(true)
      Promise.all(selectedFiles.map((file) => galleryAPI.upload(branch.id, file)))
        .then(() => loadBranchGallery(branch.id))
        .finally(() => {
          setGalleryUploading(false)
          e.target.value = ''
        })
      return
    }

    selectedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryItems(prev => [...prev, { url: reader.result as string, file }])
      }
      reader.readAsDataURL(file)
    })
  }

  /* -----------------------------------------------------
     Remove Gallery Image
  ----------------------------------------------------- */
  const removeGalleryImage = (index: number) => {
    const target = galleryItems[index]
    if (branch?.id && target?.id) {
      setGalleryDeleting(target.id)
      galleryAPI.delete(branch.id, target.id)
        .then(() => loadBranchGallery(branch.id))
        .finally(() => setGalleryDeleting(null))
      return
    }

    setGalleryItems(prev => prev.filter((_, i) => i !== index))
  }

  /* -----------------------------------------------------
     FORM SUBMIT
  ----------------------------------------------------- */
  const handleSubmit = (e: any) => {
    e.preventDefault()

    const validation = validateBranchForm(formData, operatingHoursStart, operatingHoursEnd)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})

    const formPayload = new FormData()

    /* Basic Fields */
    formPayload.append("name", formData.name)
    formPayload.append("city", formData.city)
    formPayload.append("address", formData.address)
    formPayload.append("phone", formData.phone)
    formPayload.append("email", formData.email)

    const operating_hours =
      operatingHoursStart && operatingHoursEnd
        ? `${operatingHoursStart} - ${operatingHoursEnd}`
        : formData.operating_hours

    formPayload.append("operating_hours", operating_hours)

    const delivery_time =
      `${formData.delivery_time_min}-${formData.delivery_time_max} mins`

    formPayload.append("delivery_time", delivery_time)
    formPayload.append("cuisine_type", formData.cuisine_type)
    formPayload.append("restaurant_type", formData.restaurant_type)
    formPayload.append("rating", formData.rating)
    formPayload.append("reviews_count", formData.reviews_count)
    formPayload.append("maps_iframe", formData.maps_iframe)
    formPayload.append("latitude", formData.latitude || '')
    formPayload.append("longitude", formData.longitude || '')

    /* Banner */
    if (formData.banner_image instanceof File) {
      formPayload.append("banner_image", formData.banner_image)
    } else if (formData.banner_preview) {
      // existing banner URL
      formPayload.append("banner_image_url", formData.banner_preview)
    }

    /* Gallery */
    galleryItems.forEach(item => {
      if (item.file instanceof File) {
        formPayload.append("gallery_images", item.file)
      }
    })

    /* Delivery Links */
    const deliveryLinks = [
      { name: "Swiggy", url: formData.swiggy },
      { name: "Zomato", url: formData.zomato },
      { name: "WhatsApp", url: formData.whatsapp },
    ]

    deliveryLinks.forEach((link, index) => {
      if (link.url) {
        formPayload.append(`delivery_links[${index}][name]`, link.name)
        formPayload.append(`delivery_links[${index}][url]`, link.url)
      }
    })

    /* Reviews */
    if (formData.reviews && formData.reviews.length > 0) {
      formData.reviews.forEach((review: any, index: number) => {
        formPayload.append(`reviews[${index}][customer_name]`, review.name)
        formPayload.append(`reviews[${index}][rating]`, review.rating)
        formPayload.append(`reviews[${index}][review_text]`, review.text)
      })
    }

    onSubmit(formPayload)
  }


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-card max-w-3xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <MapPin size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {branch ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Manage branch details and links</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Zap size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Branch Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  required
                />
                <FormError errors={errors} fieldName="name" />
              </div>
              <div>
                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
                <FormError errors={errors} fieldName="city" />
              </div>
            </div>
            <div>
              <FormInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                required
                textarea
              />
              <FormError errors={errors} fieldName="address" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Phone size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  required
                />
                <FormError errors={errors} fieldName="phone" />
              </div>
              <div>
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="branch@redbox.com"
                  required
                />
                <FormError errors={errors} fieldName="email" />
              </div>
            </div>
          </div>

          {/* Operating Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Clock size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Operating Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TimeRangePicker
                  label="Operating Hours"
                  startTime={operatingHoursStart}
                  endTime={operatingHoursEnd}
                  onStartTimeChange={setOperatingHoursStart}
                  onEndTimeChange={setOperatingHoursEnd}
                  required
                />
                <FormError errors={errors} fieldName="operating_hours" />
              </div>
              <div>
                <DeliveryTimePicker
                  minTime={formData.delivery_time_min}
                  maxTime={formData.delivery_time_max}
                  onMinChange={(val) => setFormData({ ...formData, delivery_time_min: val })}
                  onMaxChange={(val) => setFormData({ ...formData, delivery_time_max: val })}
                  required
                />
                <FormError errors={errors} fieldName="delivery_time" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 13.0827"
                step="0.000001"
              />
              <FormError errors={errors} fieldName="latitude" />
              <FormInput
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 80.2707"
                step="0.000001"
              />
              <FormError errors={errors} fieldName="longitude" />
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Zap size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Restaurant Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Cuisine Type"
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleChange}
                placeholder="e.g., Indo-Chinese"
              />
              <FormInput
                label="Restaurant Type"
                name="restaurant_type"
                value={formData.restaurant_type}
                onChange={handleChange}
                placeholder="e.g., Quick Service Restaurant"
              />
            </div>
          </div>

          {/* Ratings & Reviews Count */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Star size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Ratings & Reviews Count</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border border-primary/10">
              <FormInput
                label="Rating (out of 5)"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                placeholder="e.g., 4.5"
                step="0.1"
              />
              <FormInput
                label="Number of Reviews"
                name="reviews_count"
                type="number"
                value={formData.reviews_count}
                onChange={handleChange}
                placeholder="e.g., 324"
              />
            </div>
          </div>

     
          {/* Google Maps Iframe */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Map size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Location Map</h3>
            </div>
            <div>
              <div className="form-group">
                <label className="input-label">Maps Iframe URL <span className="text-primary ml-1">*</span></label>
                <textarea
                  name="maps_iframe"
                  value={formData.maps_iframe}
                  onChange={(e) => setFormData({ ...formData, maps_iframe: e.target.value })}
                  placeholder='Paste Google Maps location url'
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white text-gray-900 resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-2">Copy the map url from Google Maps and paste it here</p>
              </div>
              <FormError errors={errors} fieldName="maps_iframe" />
            </div>
          </div>

       
       {/* Banner Image Upload */}
           <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <ImageIcon size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Banner Image</h3>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border-2 border-dashed border-primary/30">

              {formData.banner_preview ? (
                <div className="space-y-3">
                  <img
                    src={formData.banner_preview}
                    alt="Banner"
                    className="w-full h-48 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => setFormData((prev:any) => ({ ...prev, banner_image: null, banner_preview: '' }))}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">

                  <Upload size={32} className="text-gray-400 mx-auto" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="block w-full text-sm"
                  />

                  <p className="text-xs text-gray-500">
                    Upload banner image (recommended 1200x400px)
                  </p>

                </div>
              )}
            </div>
          </div>


          {/* Photo Gallery */}
<div className="space-y-4">
  <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
    <ImageIcon size={20} className="text-primary" />
    <h3 className="text-lg font-bold text-foreground">Photo Gallery</h3>
  </div>

  {galleryItems.length > 0 ? (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">
        {galleryItems.length} photo(s) uploaded
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {galleryItems.map((image, index) => (
          <div
            key={image.id || `${image.url}-${index}`}
            className="relative rounded-lg overflow-hidden border-2 border-primary/30 h-20 group"
          >
            <img
              src={image.url}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() =>
                removeGalleryImage(index)
              }
              disabled={galleryDeleting === image.id}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
      <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 font-medium text-sm">
        No photos uploaded yet
      </p>
    </div>
  )}

  {/* Upload Button */}
  <label className="w-full py-3 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold rounded-lg hover:from-primary/30 hover:to-secondary/30 border-2 border-primary/40 hover:border-primary/60 transition-all flex items-center justify-center gap-2 cursor-pointer">
    <Upload size={20} />
    {galleryUploading ? 'Uploading...' : 'Upload Gallery Photos'}

    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleGalleryPreview}
      disabled={galleryUploading}
      className="hidden"
    />
  </label>
</div>

          {/* Delivery Platform Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-primary/20">
              <Zap size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">Delivery Platform Links</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border border-primary/10">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">🛵 Swiggy Link</label>
                <input
                  type="url"
                  name="swiggy"
                  value={formData.swiggy || ''}
                  onChange={handleChange}
                  placeholder="https://swiggy.com/..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">🍽️ Zomato Link</label>
                <input
                  type="url"
                  name="zomato"
                  value={formData.zomato}
                  onChange={handleChange}
                  placeholder="https://zomato.com/..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">💬 WhatsApp Link</label>
                <input
                  type="url"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="https://wa.me/919..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 border-t-2 border-border w-full">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 w-full sm:w-auto"
            >
              {branch ? '✓ Update Branch' : '+ Add Branch'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 w-full sm:w-auto"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  textarea = false,
  step,
}: any) {
  return (
    <div className="form-group">
      <label className="input-label">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          className="input-field"
        />
      )}
    </div>
  )
}
