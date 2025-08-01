import { useState, useMemo } from 'react'

/**
 * Hook for pagination logic
 */
export const usePagination = <T>(data: T[], initialPerPage: number = 100) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(initialPerPage)

  const totalPages = Math.ceil(data.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage

  const currentPageData = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1) // Reset to first page when changing per page
  }

  return {
    currentPage,
    perPage,
    totalPages,
    currentPageData,
    handlePageChange,
    handlePerPageChange,
    setCurrentPage
  }
}