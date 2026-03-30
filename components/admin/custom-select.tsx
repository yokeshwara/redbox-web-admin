'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface CustomSelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: { label: string; value: string | number }[]
  placeholder?: string
  maxHeight?: number
  className?: string
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  maxHeight = 200,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      if (dropdownRef.current) {
        const selected = dropdownRef.current.querySelector('[data-selected="true"]')
        if (selected) {
          selected.scrollIntoView({ block: 'nearest' })
        }
      }
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-left flex items-center justify-between hover:border-primary focus:outline-none focus:border-primary transition-colors"
        style={{ height: '40px' }}
      >
        <span className="text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-600 transition-transform ${
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
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  data-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    option.value === value
                      ? 'bg-primary text-white font-semibold'
                      : 'text-gray-900 hover:bg-primary/10'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
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
