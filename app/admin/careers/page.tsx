'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, Pencil, Trash2, X, Check } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Pagination } from '@/components/admin/pagination'
import { careersAPI } from '@/lib/api/careers'
import { clearToken } from '@/lib/auth'

type CareerApplication = {
  id: string
  full_name: string
  email: string
  phone: string
  city?: string
  position_interested?: string
  department?: string
  years_of_experience?: string
  message?: string
  resume_url?: string
  is_reviewed: boolean
  created_at?: string
}

const FILTERS = ['All', 'Pending', 'Reviewed']

export default function CareersPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<CareerApplication[]>([])
  const [counts, setCounts] = useState({ total: 0, reviewed: 0, pending: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [reviewFilter, setReviewFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [viewingApplication, setViewingApplication] = useState<CareerApplication | null>(null)
  const [editingApplication, setEditingApplication] = useState<CareerApplication | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    void loadApplications()
  }, [currentPage, searchTerm, reviewFilter])

  useEffect(() => {
    let next = [...applications]
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      next = next.filter((application) =>
        [application.full_name, application.email, application.phone, application.position_interested, application.department, application.city]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      )
    }
    if (reviewFilter !== 'All') {
      next = next.filter((application) => application.is_reviewed === (reviewFilter === 'Reviewed'))
    }
    setFilteredApplications(next)
  }, [applications, searchTerm, reviewFilter])

  const handleAuthError = (message: string) => {
    if (message.toLowerCase().includes('unauthorized')) {
      clearToken()
      router.replace('/admin/login')
      return true
    }
    return false
  }

  const loadApplications = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await careersAPI.list(currentPage, 200, searchTerm, reviewFilter)
      setApplications(data.results || [])
      setCounts(data.counts || { total: 0, reviewed: 0, pending: 0 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load career applications'
      if (handleAuthError(message)) return
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (application: CareerApplication) => {
    try {
      const detail = await careersAPI.get(application.id)
      setViewingApplication(detail)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load application'
      if (handleAuthError(message)) return
      setErrorMessage(message)
    }
  }

  const handleEdit = async (application: CareerApplication) => {
    try {
      const detail = await careersAPI.get(application.id)
      setEditingApplication(detail)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load application'
      if (handleAuthError(message)) return
      setErrorMessage(message)
    }
  }

  const handleSave = async () => {
    if (!editingApplication) return
    try {
      setIsSaving(true)
      const updated = await careersAPI.update(editingApplication.id, editingApplication)
      setApplications((current) => current.map((item) => (item.id === editingApplication.id ? { ...item, ...updated } : item)))
      setEditingApplication(null)
      setSuccessMessage('Career application updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
      void loadApplications()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update application'
      if (handleAuthError(message)) return
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (application: CareerApplication) => {
    if (!confirm(`Delete ${application.full_name}'s career application?`)) return
    try {
      setIsDeleting(true)
      await careersAPI.delete(application.id)
      setApplications((current) => current.filter((item) => item.id !== application.id))
      setSuccessMessage('Career application deleted successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
      void loadApplications()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete application'
      if (handleAuthError(message)) return
      setErrorMessage(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-4 md:p-6 shadow-lg text-white">
          <h1 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Career Applications</h1>
          <p className="text-xs md:text-base text-red-100 mt-1">View and manage website job applications</p>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3 hover:border-primary/60 transition-colors">
            <Search size={18} className="text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, phone, position, or department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-primary/30 rounded-lg px-4 py-3">
            <select
              value={reviewFilter}
              onChange={(e) => {
                setReviewFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent outline-none text-foreground cursor-pointer"
            >
              {FILTERS.map((status) => (
                <option key={status} value={status} className="bg-white text-foreground">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin inline-flex items-center justify-center w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Position</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Reviewed</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{application.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{application.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{application.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{application.position_interested || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{application.department || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{application.years_of_experience || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${application.is_reviewed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {application.is_reviewed ? 'Reviewed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => void handleView(application)} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-semibold flex items-center gap-1">
                              <Eye size={14} />
                              View
                            </button>
                            <button onClick={() => void handleEdit(application)} className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors font-semibold flex items-center gap-1">
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button onClick={() => void handleDelete(application)} disabled={isDeleting} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50">
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {Math.ceil(filteredApplications.length / itemsPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredApplications.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                totalItems={filteredApplications.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Total Applications" value={String(counts.total || 0)} />
          <StatBox label="Pending Review" value={String(counts.pending || 0)} />
          <StatBox label="Reviewed" value={String(counts.reviewed || 0)} />
        </div>
      </div>

      {viewingApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Career Application Details</h2>
              <button onClick={() => setViewingApplication(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <DetailGrid application={viewingApplication} />
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">About</p>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingApplication.message || '-'}</p>
              </div>
              {viewingApplication.resume_url && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Resume</p>
                  <a href={viewingApplication.resume_url} target="_blank" rel="noreferrer" className="text-primary underline">
                    View Resume
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button onClick={() => setViewingApplication(null)} className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {editingApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Career Application</h2>
              <button onClick={() => setEditingApplication(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ['Full Name', 'full_name'],
                ['Email', 'email'],
                ['Phone', 'phone'],
                ['City', 'city'],
                ['Position Interested', 'position_interested'],
                ['Department', 'department'],
                ['Years of Experience', 'years_of_experience'],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <input
                    type="text"
                    value={(editingApplication as any)[key] || ''}
                    onChange={(e) => setEditingApplication((current) => ({ ...(current as CareerApplication), [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reviewed</label>
                <select
                  value={editingApplication.is_reviewed ? 'true' : 'false'}
                  onChange={(e) => setEditingApplication((current) => ({ ...(current as CareerApplication), is_reviewed: e.target.value === 'true' }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary bg-white"
                >
                  <option value="false">Pending</option>
                  <option value="true">Reviewed</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About</label>
                <textarea
                  value={editingApplication.message || ''}
                  onChange={(e) => setEditingApplication((current) => ({ ...(current as CareerApplication), message: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setEditingApplication(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancel</button>
              <button onClick={() => void handleSave()} disabled={isSaving} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check size={20} />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
    </AdminLayout>
  )
}

function DetailGrid({ application }: { application: CareerApplication }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DetailItem label="Full Name" value={application.full_name} />
      <DetailItem label="Email" value={application.email} />
      <DetailItem label="Phone" value={application.phone} />
      <DetailItem label="City" value={application.city || '-'} />
      <DetailItem label="Position Interested" value={application.position_interested || '-'} />
      <DetailItem label="Department" value={application.department || '-'} />
      <DetailItem label="Years of Experience" value={application.years_of_experience || '-'} />
      <DetailItem label="Status" value={application.is_reviewed ? 'Reviewed' : 'Pending'} />
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-600 font-semibold mb-1">{label}</p>
      <p className="text-lg text-gray-900">{value}</p>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
