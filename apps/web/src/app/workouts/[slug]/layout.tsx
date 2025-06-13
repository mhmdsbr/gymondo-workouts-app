import { PropsWithChildren } from 'react';

export default function WorkoutLayout({ children }: PropsWithChildren) {
  return (
    <div className="workout-layout">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
