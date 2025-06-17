import { useMemo } from 'react';

export function usePagination(currentPage: number, totalPages: number): (number | string)[] {
  return useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;
    const half = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    if (currentPage - half > 2) {
      pages.push('...');
    }

    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage <= half + 1) {
      end = maxVisiblePages;
    } else if (currentPage >= totalPages - half) {
      start = totalPages - maxVisiblePages + 1;
    }

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (currentPage + half < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);
}
