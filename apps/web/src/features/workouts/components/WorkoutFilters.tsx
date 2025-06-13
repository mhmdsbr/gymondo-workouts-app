'use client'

import { useMonthGenerator } from '../hooks'
import { WorkoutFiltersProps } from '../../../shared/types';

export default function WorkoutFilters({
  selectedMonth,
  setSelectedMonth,
  selectedCategories,
  allCategories,
  handleCategoryChange,
}: WorkoutFiltersProps) {
  const months = useMonthGenerator(12)

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
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

      {(selectedCategories.length > 0 || selectedMonth) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Active filters: {[
                selectedMonth && `Month: ${months.find(m => m.value === selectedMonth)?.label}`,
                selectedCategories.length > 0 && `Categories: ${selectedCategories.join(', ')}`
              ].filter(Boolean).join(' • ')}
            </div>
            <button
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