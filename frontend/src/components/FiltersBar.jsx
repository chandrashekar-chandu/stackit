// @ts-nocheck
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function FiltersBar({ sort, setSort, search, setSearch, onAsk }) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4 w-full mb-6">
      <Link to="/ask" className="btn btn-primary" onClick={onAsk}>
        Ask New question
      </Link>
      <div className="flex items-center gap-2">
        <button
          className={`btn ${sort === 'newest' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSort('newest')}
        >
          Newest
        </button>
        <button
          className={`btn ${sort === 'unanswered' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSort('unanswered')}
        >
          Unanswered
        </button>
        <div className="relative">
          <button
            className="btn btn-outline flex items-center"
            onClick={() => setShowMore((v) => !v)}
            type="button"
          >
            more
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showMore && (
            <div className="absolute z-10 mt-2 w-32 bg-white border rounded shadow">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setSort('votes')}>Most Votes</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setSort('views')}>Most Views</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-end">
        <div className="relative w-full max-w-xs flex items-center">
          <input
            type="text"
            className="input w-full pr-10"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label="Search"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
} 