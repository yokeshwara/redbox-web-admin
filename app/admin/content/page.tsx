'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Plus, Edit2, Trash2, Power } from 'lucide-react'
import { BannerForm } from '@/components/admin/banner-form'
import { bannersAPI } from '@/lib/api/banners'

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  image_url?: string
  isActive: boolean
  createdAt: string
}

export default function BannerPage() {

  const [banners, setBanners] = useState<Banner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  useEffect(() => {
    loadBanners()
  }, [])

  // ==========================
  // Load Banners
  // ==========================
  const loadBanners = async () => {

    try {

      const response = await bannersAPI.list(1, 100)

      let list: any[] = []

      if (Array.isArray(response)) list = response
      else if (Array.isArray(response?.data)) list = response.data
      else if (Array.isArray(response?.data?.items)) list = response.data.items
      else if (Array.isArray(response?.results)) list = response.results

      const mapped = list.map((banner: any) => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image || banner.image_url,
        image_url: banner.image_url,
        isActive: banner.is_active ?? banner.isActive ?? false,
        createdAt: banner.created_at || banner.createdAt
      }))

      setBanners(mapped)

    } catch (error) {

      console.error("Banner load failed:", error)

      setBanners([])

    }

  }

  // ==========================
  // Add Banner
  // ==========================
  const handleAddBanner = async (data: {
    title: string
    subtitle: string
    image: File | null
  }) => {

    try {

      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("subtitle", data.subtitle)

      if (data.image) {
        formData.append("image", data.image)
      }

      await bannersAPI.create(formData)

      await loadBanners()

      setShowForm(false)

    } catch (error) {

      console.error("Create banner failed", error)

    }

  }

  // ==========================
  // Update Banner
  // ==========================
  const handleEditBanner = async (data: {
    title: string
    subtitle: string
    image: File | null
  }) => {

    if (!editingBanner) return

    try {

      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("subtitle", data.subtitle)

      if (data.image) {
        formData.append("image", data.image)
      }

      await bannersAPI.update(editingBanner.id, formData)

      await loadBanners()

      setEditingBanner(null)

      setShowForm(false)

    } catch (error) {

      console.error("Update banner failed", error)

    }

  }

  // ==========================
  // Activate Banner
  // ==========================
  const handleActivateBanner = async (id: string) => {

    try {

      await bannersAPI.activate(id)

      await loadBanners()

    } catch (error) {

      console.error("Activate banner failed", error)

    }

  }

  // ==========================
  // Delete Banner
  // ==========================
  const handleDeleteBanner = async (id: string) => {

    try {

      await bannersAPI.delete(id)

      await loadBanners()

    } catch (error) {

      console.error("Delete banner failed", error)

    }

  }

  // ==========================
  // Edit Click
  // ==========================
  const handleEditClick = async (banner: Banner) => {

    try {

      const response = await bannersAPI.get(banner.id)

      const apiBanner = response?.data || response

      if (!apiBanner) return

      const mappedBanner: Banner = {

        id: apiBanner.id,
        title: apiBanner.title,
        subtitle: apiBanner.subtitle,
        image: apiBanner.image || apiBanner.image_url,
        image_url: apiBanner.image_url,
        isActive: apiBanner.is_active ?? apiBanner.isActive ?? false,
        createdAt: apiBanner.created_at || apiBanner.createdAt

      }

      setEditingBanner(mappedBanner)

      setShowForm(true)

    } catch (error) {

      console.error("Edit fetch failed", error)

    }

  }

  const activeBanner = banners.find((b) => b.isActive)

  return (
    <AdminLayout>

      <div className="space-y-4 md:space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg text-white flex items-center justify-between">

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Banner Management
            </h1>

            <p className="text-xs md:text-base text-red-100 mt-1">
              Create and manage multiple banners
            </p>
          </div>

          <button
            onClick={() => {
              setEditingBanner(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold"
          >
            <Plus size={20} />
            Add Banner
          </button>

        </div>

        {/* Active Banner */}
        {activeBanner && (

          <div className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-lg">

            <div className="p-6">

              <img
                src={activeBanner.image}
                alt={activeBanner.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {activeBanner.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {activeBanner.subtitle}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* Table */}
        <div className="bg-white border-2 border-red-200 rounded-lg overflow-hidden shadow-lg">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Subtitle</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>

            </thead>

            <tbody>

              {banners.map((banner) => (

                <tr key={banner.id}>

                  <td className="px-6 py-4">
                    {banner.title}
                  </td>

                  <td className="px-6 py-4">
                    {banner.subtitle}
                  </td>

                  <td className="px-6 py-4">
                    {banner.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <div className="flex justify-end gap-2">

                      {!banner.isActive && (
                        <button
                          onClick={() => handleActivateBanner(banner.id)}
                        >
                          <Power size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleEditClick(banner)}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onSubmit={editingBanner ? handleEditBanner : handleAddBanner}
          onClose={() => {
            setShowForm(false)
            setEditingBanner(null)
          }}
        />
      )}

    </AdminLayout>
  )
}