import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  errors: { [key: string]: string }
  fieldName: string
}

export function FormError({ errors, fieldName }: FormErrorProps) {
  const error = errors[fieldName]
  
  if (!error) return null

  return (
    <div className="flex items-start gap-2 mt-1 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  )
}
