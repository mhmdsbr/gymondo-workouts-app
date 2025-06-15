import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WorkoutFilters from '../src/features/workouts/components/WorkoutFilters'

jest.mock('../src/features/workouts/hooks', () => ({
  useMonthGenerator: jest.fn(() => [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' }
  ])
}))

describe('WorkoutFilters Component', () => {
  const mockProps = {
    selectedMonth: '',
    setSelectedMonth: jest.fn(),
    selectedCategories: [],
    allCategories: ['Cardio', 'Strength', 'Yoga'],
    handleCategoryChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders filter controls correctly', () => {
    render(<WorkoutFilters {...mockProps} />)

    expect(screen.getByLabelText('Start Date')).toBeInTheDocument()
    expect(screen.getByTestId('month-filter')).toBeInTheDocument()
    expect(screen.getByText('All Months')).toBeInTheDocument()
    expect(screen.getByText('January 2024')).toBeInTheDocument()

    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByTestId('category-cardio')).toBeInTheDocument()
    expect(screen.getByTestId('category-strength')).toBeInTheDocument()
    expect(screen.getByTestId('category-yoga')).toBeInTheDocument()
  })

  test('handles month selection change', () => {
    render(<WorkoutFilters {...mockProps} />)

    const monthSelect = screen.getByTestId('month-filter')
    fireEvent.change(monthSelect, { target: { value: '2024-01' } })

    expect(mockProps.setSelectedMonth).toHaveBeenCalledWith('2024-01')
  })

  test('handles category button clicks', () => {
    render(<WorkoutFilters {...mockProps} />)

    const cardioButton = screen.getByTestId('category-cardio')
    fireEvent.click(cardioButton)

    expect(mockProps.handleCategoryChange).toHaveBeenCalledWith('Cardio')
  })

  test('shows active filters section when filters are applied', () => {
    const propsWithFilters = {
      ...mockProps,
      selectedMonth: '2024-01',
      selectedCategories: ['Cardio', 'Strength']
    }

    render(<WorkoutFilters {...propsWithFilters} />)

    expect(screen.getByTestId('active-filters-section')).toBeInTheDocument()
    expect(screen.getByTestId('active-filters-text')).toBeInTheDocument()
    expect(screen.getByTestId('clear-all-filters')).toBeInTheDocument()
    expect(screen.getByText('Active filters: Month: January 2024 • Categories: Cardio, Strength')).toBeInTheDocument()
  })

  test('hides active filters section when no filters are applied', () => {
    render(<WorkoutFilters {...mockProps} />)

    expect(screen.queryByTestId('active-filters-section')).not.toBeInTheDocument()
  })

  test('clears all filters when clear button is clicked', () => {
    const propsWithFilters = {
      ...mockProps,
      selectedMonth: '2024-01',
      selectedCategories: ['Cardio']
    }

    render(<WorkoutFilters {...propsWithFilters} />)

    const clearButton = screen.getByTestId('clear-all-filters')
    fireEvent.click(clearButton)

    expect(mockProps.setSelectedMonth).toHaveBeenCalledWith('')
    expect(mockProps.handleCategoryChange).toHaveBeenCalledWith('Cardio')
  })

  test('applies selected styling to active category buttons', () => {
    const propsWithSelectedCategories = {
      ...mockProps,
      selectedCategories: ['Cardio']
    }

    render(<WorkoutFilters {...propsWithSelectedCategories} />)

    const cardioButton = screen.getByTestId('category-cardio')
    const strengthButton = screen.getByTestId('category-strength')

    expect(cardioButton).toHaveClass('bg-blue-600', 'text-white')
    expect(strengthButton).toHaveClass('bg-gray-100', 'text-gray-800')
  })
})