// layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'California WildFire Risk Map',
  description: 'Interactive WildFire Risk Map of California counties',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='dark' lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}