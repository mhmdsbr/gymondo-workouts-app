import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WorkoutsPagination from '../src/features/workouts/components/WorkoutsPagination'

const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
})

describe('WorkoutsPagination Component', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders pagination with correct page info', () => {
    render(
      <WorkoutsPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('pagination-container')).toBeInTheDocument()
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 5')
    expect(screen.getByTestId('prev-button')).toBeInTheDocument()
    expect(screen.getByTestId('next-button')).toBeInTheDocument()
  })

  test('handles previous page navigation', () => {
    render(
      <WorkoutsPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByTestId('prev-button')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('handles next page navigation', () => {
    render(
      <WorkoutsPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByTestId('next-button')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('disables previous button on first page', () => {
    render(
      <WorkoutsPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByTestId('prev-button')
    expect(prevButton).toBeDisabled()

    fireEvent.click(prevButton)
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  test('disables next button on last page', () => {
    render(
      <WorkoutsPagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeDisabled()

    fireEvent.click(nextButton)
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  test('handles page button clicks', () => {
    render(
      <WorkoutsPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const pageButton = screen.getByTestId('page-button-3')
    fireEvent.click(pageButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('applies correct styling to current page button', () => {
    render(
      <WorkoutsPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const currentPageButton = screen.getByTestId('page-button-2')
    const otherPageButton = screen.getByTestId('page-button-1')

    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white')
    expect(otherPageButton).toHaveClass('bg-white', 'text-gray-700')
  })

  test('handles single page scenario', () => {
    render(
      <WorkoutsPagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 1')
    expect(screen.getByTestId('prev-button')).toBeDisabled()
    expect(screen.getByTestId('next-button')).toBeDisabled()
  })
})