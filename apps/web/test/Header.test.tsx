import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../src/shared/components/Header';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, priority, sizes, style, ...props }: any) {
    // Convert Next.js Image props to standard img props
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill ? 'true' : 'false'}
        data-priority={priority ? 'true' : 'false'}
        data-sizes={sizes}
        style={style}
        {...props}
      />
    );
  };
});

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header with correct structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex justify-center w-full z-50');
  });

  it('should render logo image with correct attributes', () => {
    render(<Header />);

    const logo = screen.getByAltText('Site Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/gymondoLogo.png');
  });

  it('should render reload button with correct aria-label', () => {
    render(<Header />);

    const reloadButton = screen.getByLabelText('Reload Page');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveClass('cursor-pointer');
  });

  it('should call window.location.reload when button is clicked', () => {
    render(<Header />);

    const reloadButton = screen.getByLabelText('Reload Page');
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes', () => {
    render(<Header />);

    const headerContent = screen.getByLabelText('Reload Page').parentElement;
    expect(headerContent).toHaveClass(
      'flex justify-center w-full py-5 text-2xl lg:text-3xl font-semibold px-10 bg-primary'
    );
  });

  it('should have logo container with correct dimensions', () => {
    render(<Header />);

    const logoContainer = screen.getByAltText('Site Logo').parentElement;
    expect(logoContainer).toHaveClass('relative w-[50px] h-[40px]');
  });
});