// @ts-nocheck
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          {'<'}
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-2 rounded-lg ${
              p === page
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
} 