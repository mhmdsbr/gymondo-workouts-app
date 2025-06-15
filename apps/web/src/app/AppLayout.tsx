import { PropsWithChildren } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}