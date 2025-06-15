import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../src/shared/components/Footer';

describe('Footer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display correct heading and description', () => {
    render(<Footer />);

    const heading = screen.getByText('Workout Assessment');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-lg font-semibold text-white');

    const description = screen.getByText('Stay healthy with Gymondo workout programs');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm text-gray-100 mt-1');
  });

  it('should display current year in copyright text', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(
      `© ${currentYear}Gymondo Workout Assessment App. All rights reserved.`
    );
    expect(copyrightText).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    render(<Footer />);

    const container = screen.getByText('Workout Assessment').closest('.container');
    expect(container).toHaveClass('container mx-auto px-4');
  });

  it('should have responsive flex layout', () => {
    render(<Footer />);

    const flexContainer = screen.getByText('Workout Assessment').closest('.flex');
    expect(flexContainer).toHaveClass('flex flex-col md:flex-row justify-between items-center');
  });

  it('should update year dynamically', () => {
    jest.setSystemTime(new Date('2025-06-14'));
    render(<Footer />);

    const copyrightText = screen.getByText(
      '© 2025Gymondo Workout Assessment App. All rights reserved.'
    );
    expect(copyrightText).toBeInTheDocument();
  });
});