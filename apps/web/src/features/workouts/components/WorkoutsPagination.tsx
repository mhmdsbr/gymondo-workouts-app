'use client'

import { PaginationProps } from '../../../shared/types';
import { usePagination } from '../hooks';

/**
 *
 * This component renders a pagination with the following features:
 * - Previous/Next navigation
 * - Page number buttons with ellipsis for large page counts
 */
export default function WorkoutsPagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {

  const pages = usePagination(currentPage, totalPages);


  /**
   * Handle previous page navigation
   */
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Handle next page navigation
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-8" data-testid="pagination-container">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center space-x-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          data-testid="prev-button"
          className={`
            flex w-[50px] items-center justify-center cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:bg-gray-100'
            }
          `}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-1">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 font-medium"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                data-testid={`page-button-${page}`}
                onClick={() => {
                  onPageChange(Number(page))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`
                  flex items-center justify-center cursor-pointer w-10 h-10 text-sm font-medium rounded-lg border transition-all duration-200
                  ${currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          data-testid="next-button"
          className={`
            flex w-[50px] items-center justify-center cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:bg-gray-100'
            }
          `}
        >
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-sm text-gray-600 font-medium" data-testid="page-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}