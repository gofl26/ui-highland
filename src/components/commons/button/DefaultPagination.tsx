'use client'

import { useMemo, useState } from 'react'

interface PaginationProps {
  totalCount: number
  onChange: (event: any, page: number) => void
  totalPerCount?: number
}

export default function DefaultPagination({
  totalCount,
  totalPerCount = 5,
  onChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const pageCount = useMemo(() => {
    return totalCount === 0 ? 1 : Math.ceil(totalCount / totalPerCount)
  }, [totalCount, totalPerCount])

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  const handleClick = (page: number) => {
    setCurrentPage(page)
    onChange(null, page)
  }
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border px-2 py-1 text-sm disabled:opacity-50"
      >
        {'<'}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          className={`rounded border px-3 py-1 text-sm 
            ${page === currentPage ? 'bg-bgBtnPrimary text-textBtnPrimary' : 'hover:bg-gray-100'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === pageCount}
        className="rounded border px-2 py-1 text-sm disabled:opacity-50"
      >
        {'>'}
      </button>
    </div>
  )
}
