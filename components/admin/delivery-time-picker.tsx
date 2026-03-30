'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { CustomSelect } from './custom-select'

interface DeliveryTimePickerProps {
  minTime: number
  maxTime: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  required?: boolean
}

export function DeliveryTimePicker({
  minTime,
  maxTime,
  onMinChange,
  onMaxChange,
  required = false,
}: DeliveryTimePickerProps) {
  const timeOptions = Array.from({ length: 60 }, (_, i) => i + 1)

  return (
    <div className="form-group relative">
      <label className="input-label">
        Delivery Time
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white">
        <Clock size={20} className="text-primary flex-shrink-0" />

        <div className="flex-1">
          <CustomSelect
            value={minTime}
            onChange={(val) => onMinChange(Number(val))}
            placeholder="Min time"
            options={[
              ...timeOptions.map((val) => ({
                label: `${val} min`,
                value: val,
              })),
            ]}
            maxHeight={250}
          />
        </div>

        <span className="text-gray-500 font-semibold">-</span>

        <div className="flex-1">
          <CustomSelect
            value={maxTime}
            onChange={(val) => onMaxChange(Number(val))}
            placeholder="Max time"
            options={[
              ...timeOptions.map((val) => ({
                label: `${val} min`,
                value: val,
              })),
            ]}
            maxHeight={250}
          />
        </div>
      </div>
    </div>
  )
}
