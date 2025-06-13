import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: 'Workout App',
  description: 'Your fitness companion',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow p-6 mx-auto w-full max-w-7xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}