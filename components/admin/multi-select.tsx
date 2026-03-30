'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: { label: string; value: string }[]
  placeholder?: string
  maxHeight?: number
  className?: string
  isLoading?: boolean
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Select options',
  maxHeight = 250,
  className = '',
  isLoading = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOptions = options.filter((opt) => value.includes(opt.value))
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(opt.value)
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove))
  }

  const handleAdd = (optionValue: string) => {
    if (!value.includes(optionValue)) {
      onChange([...value, optionValue])
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-left flex items-center justify-between hover:border-primary focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[40px] flex-wrap gap-2"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <div
                key={opt.value}
                className="bg-primary text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
              >
                <span>{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(opt.value)
                  }}
                  className="hover:bg-primary/80 rounded p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-600 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50"
          style={{
            top: `${dropdownPosition.top + 8}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
          }}
        >
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div className="p-2">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : filteredOptions.length === 0 && selectedOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No more options</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleAdd(option.value)
                    setSearchTerm('')
                  }}
                  className="w-full text-left px-3 py-2 text-sm transition-colors text-gray-900 hover:bg-primary/10 rounded"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>

          {selectedOptions.length > 0 && filteredOptions.length > 0 && (
            <>
              <div className="border-t border-gray-200 p-2">
                <p className="text-xs text-gray-500 px-1 py-1 font-semibold">Selected ({selectedOptions.length})</p>
                <div className="space-y-1">
                  {selectedOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className="px-3 py-2 text-sm bg-primary/10 text-gray-900 rounded flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(opt.value)}
                        className="text-primary hover:text-primary/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        div[style*='maxHeight'] {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
        div[style*='maxHeight']::-webkit-scrollbar {
          width: 6px;
        }
        div[style*='maxHeight']::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        div[style*='maxHeight']::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}
