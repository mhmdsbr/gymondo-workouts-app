import { getDifficultyColors } from "../../features/workouts/utils";
import { BadgeProps } from "../types";

export const Badge = ({ children, variant, difficulty, size }: BadgeProps) => {
  const baseClasses = `px-2 py-1 rounded-full font-medium ${
    size === 'sm' ? 'text-xs' : 'text-sm px-5'
  }`;

  const variantClasses = {
    difficulty: getDifficultyColors(difficulty || ''),
    category: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};