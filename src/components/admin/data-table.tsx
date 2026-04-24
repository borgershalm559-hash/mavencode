"use client";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="border-2 border-white/[0.07] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-white/[0.03] border-b-2 border-white/[0.05]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs text-white/40 font-mono uppercase tracking-[0.15em] font-medium"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-xs text-white/40 font-mono uppercase tracking-[0.15em] font-medium">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-4 py-8 text-center text-sm text-white/25 font-mono"
              >
                Нет данных
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-white/70">
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-2.5 py-1 border border-[#10B981]/20 text-xs font-mono text-[#10B981]/80 hover:text-[#10B981] hover:bg-[#10B981]/[0.06] transition-all"
                        >
                          Изм.
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-2.5 py-1 border border-red-400/20 text-xs font-mono text-red-400/70 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          Удл.
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
  );
}
