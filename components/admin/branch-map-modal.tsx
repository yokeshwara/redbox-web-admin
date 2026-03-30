'use client'

import { X, MapPin, Phone, Mail } from 'lucide-react'

interface BranchMapModalProps {
  branches: any[]
  onClose: () => void
}

export function BranchMapModal({ branches, onClose }: BranchMapModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-card rounded-lg border border-border">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white z-10">
          <h2 className="text-2xl font-bold">Branch Locations</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Map Container */}
          <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-6 flex items-center justify-center border-2 border-primary/30">
            <div className="text-center">
              <MapPin size={48} className="text-primary mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">Interactive Map</p>
              <p className="text-muted-foreground text-sm max-w-xs">
                All {branches.length} branch locations are displayed below with their coordinates and details
              </p>
            </div>
          </div>

          {/* Branches List with Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((branch) => (
              <div key={branch.id} className="p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:border-primary/40 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{branch.address}</p>
                    
                    {/* Location coordinates */}
                    <div className="mb-3 p-2 bg-background rounded">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Coordinates:</span> {branch.latitude?.toFixed(4)}, {branch.longitude?.toFixed(4)}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                        <a href={`tel:${branch.phone}`} className="text-blue-600 hover:underline truncate">
                          {branch.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                        <a href={`mailto:${branch.email}`} className="text-blue-600 hover:underline truncate">
                          {branch.email}
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Hours:</span> {branch.hours}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        branch.status === 'Active' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {branch.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-8 border-t-2 border-primary/20">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded"></span>
              Coverage Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
                <p className="text-muted-foreground text-sm mb-1 font-medium">Total Branches</p>
                <p className="text-3xl font-bold text-primary">{branches.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
                <p className="text-muted-foreground text-sm mb-1 font-medium">Cities Covered</p>
                <p className="text-3xl font-bold text-primary">{new Set(branches.map(b => b.city)).size}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
                <p className="text-muted-foreground text-sm mb-1 font-medium">Active Branches</p>
                <p className="text-3xl font-bold text-primary">{branches.filter(b => b.status === 'Active').length}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
