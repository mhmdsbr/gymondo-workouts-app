import { useEffect, useState } from 'react';

export function useDebouncedFilters(DEBOUNCE_DELAY: number = 300) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [debouncedMonth, setDebouncedMonth] = useState('');
  const [debouncedCategories, setDebouncedCategories] = useState<string[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    if (!isClientLoaded && selectedMonth === '') return;
    setIsTransitioning(true);
    const t = setTimeout(() => {
      setDebouncedMonth(selectedMonth);
      setIsTransitioning(false);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [selectedMonth]);

  useEffect(() => {
    if (!isClientLoaded && selectedCategories.length === 0) return;
    setIsTransitioning(true);
    const t = setTimeout(() => {
      setDebouncedCategories(selectedCategories);
      setIsTransitioning(false);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [selectedCategories]);

  return {
    selectedMonth,
    setSelectedMonth,
    selectedCategories,
    setSelectedCategories,
    debouncedMonth,
    debouncedCategories,
    isClientLoaded,
    isTransitioning,
  };
}
