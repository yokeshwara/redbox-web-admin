
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {

  const getPages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // always show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      // always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-t-2 border-gray-200">
      <div className="text-xs md:text-sm text-gray-600">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 md:p-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {getPages().map((page, index) =>
            page === '...' ? (
              <span key={index} className="px-2 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-2 md:px-3 py-1 md:py-2 rounded-lg font-semibold text-xs md:text-sm ${
                  currentPage === page
                    ? 'bg-red-600 text-white'
                    : 'border-2 border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 md:p-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}