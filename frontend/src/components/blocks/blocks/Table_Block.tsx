import type { BlockContent, TableData } from '@/types';

interface Table_BlockProps {
  content: BlockContent;
  data?: { tableData?: TableData } | null;
  isEditing?: boolean;
  onChange?: (content: BlockContent) => void;
}

export function Table_Block({ content, data, isEditing = false, onChange }: Table_BlockProps) {
  const tableData = data?.tableData;

  if (isEditing) {
    return (
      <div className="w-full h-full p-8 overflow-auto">
        {tableData ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {tableData.headers.map((header, i) => (
                  <th key={i} className="bg-alecia-navy text-white px-4 py-3 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#bfd7ea]/20'}>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="px-4 py-3 border border-alecia-silver/20">
                      {cell || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-alecia-silver text-center">Aucune donnée de tableau</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 overflow-auto">
      {tableData ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableData.headers.map((header, i) => (
                <th key={i} className="bg-alecia-navy text-white px-4 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#bfd7ea]/20'}>
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 border border-alecia-silver/20 ${
                      row.highlight === 'positive'
                        ? 'bg-green-100'
                        : row.highlight === 'negative'
                        ? 'bg-red-100'
                        : ''
                    }`}
                  >
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-alecia-silver text-center">Aucune donnée de tableau</p>
      )}
    </div>
  );
}
