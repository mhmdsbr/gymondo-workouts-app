export function useWorkoutDisplayRange(
  currentPage: number,
  pageSize: number,
  totalItems: number
) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  return { startIndex, endIndex };
}
