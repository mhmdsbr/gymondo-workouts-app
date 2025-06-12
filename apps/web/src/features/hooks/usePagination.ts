import { useState, useMemo, useEffect } from 'react'

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  // Calculate current items to display
  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return items.slice(indexOfFirstItem, indexOfLastItem)
  }, [items, currentPage, itemsPerPage])

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1)
  }, [items])

  const paginationInfo = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return {
      startIndex: indexOfFirstItem + 1,
      endIndex: Math.min(indexOfLastItem, items.length),
      totalItems: items.length,
    }
  }, [currentPage, itemsPerPage, items.length])

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    paginationInfo,
  }
}