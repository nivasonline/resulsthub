export default function Table({ columns, data, keyField = 'id', onRowClick, emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-16 text-center text-mist-400 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.03] border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 font-medium text-mist-300 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-white/5 last:border-0 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-mist-100 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
