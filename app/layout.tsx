import './globals.css'
import type { Metadata } from 'next'
import { Inter, Pridi } from 'next/font/google'
import { Providers } from "./providers";
import Navbar from './_components/navbar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
const inter = Inter({ subsets: ['latin'] })
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <Providers>
          <Navbar session={session} />
          {children}
        </Providers>
      </body>
    </html>
  )
}