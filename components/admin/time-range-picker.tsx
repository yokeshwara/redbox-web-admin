'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { CustomSelect } from './custom-select'

interface TimeRangePickerProps {
  label: string
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  required?: boolean
}

export function TimeRangePicker({
  label,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  required = false,
}: TimeRangePickerProps) {
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
        const display = new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        options.push({ value: time, display })
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const formatTimeDisplay = (time: string) => {
    if (!time) return 'Select time'
    try {
      const [hour, min] = time.split(':')
      const date = new Date(`2000-01-01 ${hour}:${min}`)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return time
    }
  }

  return (
    <div className="form-group relative">
      <label className="input-label">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white">
        <Clock size={20} className="text-primary flex-shrink-0" />
        
        <div className="flex-1">
          <CustomSelect
            value={startTime}
            onChange={onStartTimeChange}
            options={[
              { label: 'Start time', value: '' },
              ...timeOptions.map((opt) => ({
                label: opt.display,
                value: opt.value,
              })),
            ]}
            maxHeight={250}
          />
        </div>

        <span className="text-gray-500 font-semibold">-</span>

        <div className="flex-1">
          <CustomSelect
            value={endTime}
            onChange={onEndTimeChange}
            options={[
              { label: 'End time', value: '' },
              ...timeOptions.map((opt) => ({
                label: opt.display,
                value: opt.value,
              })),
            ]}
            maxHeight={250}
          />
        </div>
      </div>
    </div>
  )
}
