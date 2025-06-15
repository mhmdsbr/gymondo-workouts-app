'use client'

import { useMonthGenerator } from '../hooks'
import { WorkoutFiltersProps } from '../../../shared/types';

/**
 *
 * This client component provides filtering capabilities including:
 * - Month-based filtering with dropdown selection
 * - Multi-select category filtering with toggle buttons
 * - Active filter display and management
 * - Clear all filters functionality
 *
 * State is managed by parent component and passed down as props along
 * with handler functions for state updates.
 *
 * @param selectedMonth - Currently selected month filter value
 * @param setSelectedMonth - Function to update month filter
 * @param selectedCategories - Array of currently selected category filters
 * @param allCategories - Complete list of available categories
 * @param handleCategoryChange - Function to toggle category selection
 */
export default function WorkoutFilters({
  selectedMonth,
  setSelectedMonth,
  selectedCategories,
  allCategories,
  handleCategoryChange,
}: WorkoutFiltersProps) {
  const months = useMonthGenerator(12)

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200" data-testid="workout-filters">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            data-testid="month-filter"
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters summary and clear action - Only shows when filters are applied */}
      {(selectedCategories.length > 0 || selectedMonth) && (
        <div className="mt-4 pt-4 border-t border-gray-200" data-testid="active-filters-section">
          <div className="flex items-center justify-between">
            {/* Dynamic filter summary text */}
            <div className="text-sm text-gray-600" data-testid="active-filters-text">
              Active filters: {[
                selectedMonth && `Month: ${months.find(m => m.value === selectedMonth)?.label}`,
                selectedCategories.length > 0 && `Categories: ${selectedCategories.join(', ')}`
              ].filter(Boolean).join(' • ')}
            </div>
            {/* Clear all filters button */}
            <button
              data-testid="clear-all-filters"
              onClick={() => {
                setSelectedMonth('');
                selectedCategories.forEach(cat => handleCategoryChange(cat));
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}