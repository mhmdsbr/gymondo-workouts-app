import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Poppins } from "next/font/google";
import './globals.css';
import AppLayout from './AppLayout';

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
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
