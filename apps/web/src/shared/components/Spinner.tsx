import { SpinnerProps } from "../types";

export const Spinner = ({ size = 'lg', className = '' }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-7 w-7',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`text-center py-4 ${className}`}>
      <div className={`inline-block animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
};