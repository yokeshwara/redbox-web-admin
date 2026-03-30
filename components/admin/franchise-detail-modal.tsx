'use client'

import { useState } from 'react'
import { X, FileText, Calendar, MessageSquare, Plus, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react'

interface FranchiseDetailModalProps {
  franchise: any
  onClose: () => void
  onUpdate: (franchise: any) => void
}

export function FranchiseDetailModal({ franchise, onClose, onUpdate }: FranchiseDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'notes'>('overview')
  const [internalNotes, setInternalNotes] = useState(franchise.internalNotes || '')
  const [newNote, setNewNote] = useState('')

  const statusIcons: any = {
    'Enquiry': <AlertCircle className="text-blue-500" size={20} />,
    'Approved': <CheckCircle className="text-yellow-500" size={20} />,
    'Active': <CheckCircle className="text-green-500" size={20} />,
    'Inactive': <Clock className="text-red-500" size={20} />,
  }

  const statusColors: any = {
    'Enquiry': 'bg-blue-100 text-blue-700 border-blue-300',
    'Approved': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Active': 'bg-green-100 text-green-700 border-green-300',
    'Inactive': 'bg-red-100 text-red-700 border-red-300',
  }

  const getLeadQuality = (score: number) => {
    if (score >= 80) return { label: 'Hot Lead', color: 'text-green-600' }
    if (score >= 60) return { label: 'Warm Lead', color: 'text-yellow-600' }
    return { label: 'Cold Lead', color: 'text-red-600' }
  }

  const leadQuality = getLeadQuality(franchise.leadScore)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{franchise.name}</h2>
              <span className={`px-4 py-1 rounded-full text-sm font-bold border ${statusColors[franchise.status]}`}>
                {franchise.status}
              </span>
            </div>
            <p className="text-red-100 text-sm">Applied on {franchise.appliedDate}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-700 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-6 border-b border-gray-200 flex-wrap">
          {['overview', 'timeline', 'documents', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 font-semibold capitalize border-b-2 transition-all ${
                activeTab === tab
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-600 border-transparent hover:text-red-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-600 font-semibold">Lead Score</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          franchise.leadScore >= 80
                            ? 'bg-green-500'
                            : franchise.leadScore >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${franchise.leadScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-lg text-gray-900 min-w-fit">{franchise.leadScore}</span>
                  </div>
                  <p className={`text-xs font-bold mt-2 ${leadQuality.color}`}>{leadQuality.label}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">Investment</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{franchise.investmentCapacity}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 font-semibold">Location</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{franchise.location}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-gray-600 font-semibold">Documents</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{franchise.documents?.length || 0}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Email</p>
                      <p className="text-foreground font-medium break-all">{franchise.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone</p>
                      <p className="text-foreground font-medium">{franchise.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-green-600" />
                    Quick Notes
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed">{franchise.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Franchise Journey Timeline</h3>
              {franchise.timeline?.map((event: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {event.status === 'completed' ? '✓' : '◉'}
                    </div>
                    {index < (franchise.timeline?.length || 1) - 1 && (
                      <div className="w-1 h-12 bg-gray-300 mt-1"></div>
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <p className="font-bold text-gray-900">{event.event}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {event.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Documents Submitted</h3>
              {franchise.documents && franchise.documents.length > 0 ? (
                <div className="space-y-3">
                  {franchise.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="text-red-600" size={24} />
                        <div>
                          <p className="font-semibold text-gray-900">{doc}</p>
                          <p className="text-xs text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-red-200 rounded-lg transition-colors text-red-600">
                        <Download size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No documents uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Internal Notes</h3>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Current Note:</strong> {internalNotes || 'No notes added yet'}
                </p>
              </div>
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this franchise..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                  rows={4}
                />
                <button
                  onClick={() => {
                    if (newNote.trim()) {
                      setInternalNotes(newNote)
                      setNewNote('')
                      onUpdate({ ...franchise, internalNotes: newNote })
                    }
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
