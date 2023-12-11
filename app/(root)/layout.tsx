import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';
import Bottombar from '@/components/shared/Bottombar';
import Topbar from '@/components/shared/Topbar';
import Leftsidebar from '@/components/shared/Leftsidebar';
import Rightsidebar from '@/components/shared/Rightsidebar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads clone'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className='flex flex-row'>
            <Leftsidebar />
            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <Rightsidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}