import { Edit2, Trash2, Eye } from 'lucide-react'

interface TableColumn {
  header: string
  accessor: string
  render?: (value: any, row: any) => React.ReactNode
  center?: boolean
}

interface DataTableProps {
  columns: TableColumn[]
  data: any[]
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
  actions?: boolean
}

export function DataTable({ columns, data, onEdit, onDelete, onView, actions = true }: DataTableProps) {
  return (
    <div className="modal-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="overflow-x-auto scroll-smooth">
        <table className="w-full min-w-max">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20 sticky top-0 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={`${col.accessor}-${idx}`} 
                  className="px-3 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-foreground uppercase tracking-wide"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-3 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-foreground uppercase tracking-wide">⚙️ Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 md:px-6 py-12 text-center">
                  <p className="text-muted-foreground font-medium">📭 No data available</p>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-200 group"
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={`${row.id}-${col.accessor}-${colIdx}`} 
                      className="px-3 md:px-6 py-4 md:py-5 text-xs md:text-sm text-foreground font-medium"
                      style={{ width: col.width }}
                    >
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 md:px-6 py-4 md:py-5">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-150 hover:scale-110"
                            title="View"
                          >
                            <Eye size={16} className="md:block hidden" />
                            <Eye size={14} className="md:hidden" />
                          </button>
                        )}
                   {onEdit && (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onEdit(row)
    }}
    className="p-2 text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-150 hover:scale-110"
    title="Edit"
  >
    <Edit2 size={16} className="md:block hidden" />
    <Edit2 size={14} className="md:hidden" />
  </button>
)}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-150 hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={16} className="md:block hidden" />
                            <Trash2 size={14} className="md:hidden" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
