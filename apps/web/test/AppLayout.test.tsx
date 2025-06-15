import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppLayout from '../src/app/AppLayout';

jest.mock('../src/shared/components/Header', () => () => (
  <div data-testid="header">Header</div>
));

jest.mock('../src/shared/components/Footer', () => () => (
  <div data-testid="footer">Footer</div>
));

describe('AppLayout', () => {
  it('should render header, main and footer', () => {
    render(
      <AppLayout>
        <div data-testid="content">Test</div>
      </AppLayout>,
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should have single main landmark', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveClass('flex-grow');
  });

  it('should apply correct classes', () => {
    render(
      <AppLayout>
        <div>Test</div>
      </AppLayout>,
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('p-6', 'mx-auto', 'max-w-7xl');
  });

  it('should render children in main content', () => {
    render(
      <AppLayout>
        <section data-testid="child-content">Content</section>
      </AppLayout>,
    );

    const child = screen.getByTestId('child-content');
    const main = screen.getByRole('main');

    expect(main).toContainElement(child);
  });
});
