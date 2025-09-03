export default function DataTable({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key || c} className="px-4 py-2 text-left text-sm text-gray-600">{c.label || c}</th>
            ))}
            {actions && <th className="px-4 py-2 text-left text-sm text-gray-600">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="border-t hover:bg-gray-50">
              {columns.map((c) => {
                const key = c.key || c
                return <td key={key} className="px-4 py-2 text-sm">{c.render ? c.render(row) : row[key]}</td>
              })}
              {actions && <td className="px-4 py-2">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
