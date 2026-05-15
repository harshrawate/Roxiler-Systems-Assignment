import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const Table = ({ columns, data, onSort, sortConfig = {} }) => {
  const renderSortIcon = (key) => {
    if (!onSort) return null;
    if (sortConfig.sortBy !== key) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortConfig.order === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary-600" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary-600" />;
  };

  const handleSort = (key) => {
    if (!onSort || !key) return;
    const newOrder = sortConfig.sortBy === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                  col.sortable && onSort ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
